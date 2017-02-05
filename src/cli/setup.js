const AWS = require('aws-sdk')
const prompt = require('prompt')
const colors = require('colors/safe')
const fs = require('fs')
const path = require('path')
const { mapKeys, camelCase } = require('lodash')

const config = {}

const COGNITO_REGION = 'eu-west-1'
let COGNITO_FEDERATED_ID_NAME

let credentials
let s3
let cognitoServiceProvider
let cognitoIdentity
let iam

module.exports = function setup () {
  initialPrompt()
    .then(createBucket)
    .then(putBucketWebsite)
    .then(createBucketPolicy)
    .then(updateCORS)
    .then(createCloudFrontDistribution)
    .then(setUpCognito)
    .then(writeConfigFile)
    .then(createUser)
    .then(confirmUser)
    .catch(err => {
      console.log(err)
    })
}

function initialPrompt () {
  return new Promise((resolve, reject) => {
    prompt.message = '🔧 '
    console.log('Setup will configure AWS with Cognito, S3 and CloudFront')
    prompt.get([{
      name: 'AWS_ACCESS_KEY_ID',
      description: colors.green('Enter your AWS_ACCESS_KEY_ID'),
      required: true
    }, {
      name: 'AWS_SECRET_ACCESS_KEY',
      description: colors.green('Enter your AWS_SECRET_ACCESS_KEY'),
      required: true
    }, {
      name: 'S3_REGION',
      description: colors.green('Enter your S3_REGION'),
      default: 'eu-west-1',
      required: true
    }, {
      name: 'S3_BUCKET',
      description: colors.green('Enter your S3_BUCKET name'),
      required: true
    }], (error, result) => {
      if (error) {
        console.error('All fields are required')
      } else {
        credentials = {
          accessKeyId: result.AWS_ACCESS_KEY_ID,
          secretAccessKey: result.AWS_SECRET_ACCESS_KEY
        }

        config.S3_REGION = result.S3_REGION
        config.S3_BUCKET = result.S3_BUCKET

        s3 = new AWS.S3({
          credentials,
          region: config.S3_REGION,
          params: {
            Bucket: config.S3_BUCKET,
            ACL: 'public-read'
          }
        })

        cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
          credentials,
          region: COGNITO_REGION
        })

        cognitoIdentity = new AWS.CognitoIdentity({
          credentials,
          region: COGNITO_REGION
        })

        iam = new AWS.IAM({
          credentials,
          region: COGNITO_REGION
        })

        COGNITO_FEDERATED_ID_NAME = config.S3_BUCKET.toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '')

        resolve()
      }
    })
  })
}

function setUpCognito () {
  return createUserPool()
    .then(createUserPoolClient)
    .then(createIdentityPool)
    .then(createUnauthRole)
    .then(createAuthRole)
    .then(setIdentityPoolRoles)
}

function createBucket () {
  return new Promise((resolve, reject) => {
    s3.headBucket(null, (err, data) => {
      if (err) {
        console.log('Bucket not found…')
        console.log('Creating bucket…')

        s3.createBucket(null, (err, data) => {
          if (err) {
            console.log('Error creating bucket')
            reject(err.message)
          } else {
            console.log('Successfully created bucket')
            resolve()
          }
        })
      } else {
        console.log('Bucket found…')
        resolve()
      }
    })
  })
}

function putBucketWebsite () {
  return new Promise((resolve, reject) => {
    s3.putBucketWebsite({
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: 'index.html'
        }
      }
    }, (err, data) => {
      if (err) {
        console.log('Failed to enable bucket website')
        reject(err)
      } else {
        console.log('Successfully enabled bucket website')
        resolve()
      }
    })
  })
}

function createBucketPolicy () {
  return new Promise((resolve, reject) => {
    s3.putBucketPolicy({
      Policy: `{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "PublicReadGetObject",
              "Effect": "Allow",
              "Principal": "*",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::${config.S3_BUCKET}/*"
            }
          ]
      }`
    }, (err, data) => {
      if (err) {
        console.log('Failed to create bucket policy')
        reject()
      } else {
        console.log('Successfully created bucket policy')
        resolve()
      }
    })
  })
}

function updateCORS () {
  return new Promise((resolve, reject) => {
    s3.putBucketCors({
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
            AllowedOrigins: ['*']
          }
        ]
      }
    }, (err, data) => {
      if (err) {
        console.log('Error updating CORS')
        reject(err.message)
      } else {
        console.log('Successfully updated CORS configuration')
        resolve()
      }
    })
  })
}

function createCloudFrontDistribution () {
  return new Promise((resolve, reject) => {
    const getS3WebsiteEndpoint = (region, bucket) => ({
      'us-east-1': `${bucket}.s3-website-us-east-1.amazonaws.com`,
      'us-west-1': `${bucket}.s3-website-us-west-1.amazonaws.com`,
      'us-west-2': `${bucket}.s3-website-us-west-2.amazonaws.com`,
      'ap-south-1': `${bucket}.s3-website.ap-south-1.amazonaws.com`,
      'ap-northeast-2': `${bucket}.s3-website.ap-northeast-2.amazonaws.com`,
      'ap-southeast-1': `${bucket}.s3-website-ap-southeast-1.amazonaws.com`,
      'ap-southeast-2': `${bucket}.s3-website-ap-southeast-2.amazonaws.com`,
      'ap-northeast-1': `${bucket}.s3-website-ap-northeast-1.amazonaws.com`,
      'eu-central-1': `${bucket}.s3-website.eu-central-1.amazonaws.com`,
      'eu-west-1': `${bucket}.s3-website-eu-west-1.amazonaws.com`,
      'sa-east-1': `${bucket}.s3-website-sa-east-1.amazonaws.com`
    }[region])

    const cloudfront = new AWS.CloudFront({
      credentials
    })

    cloudfront.createDistribution({
      DistributionConfig: {
        CallerReference: `${Date.now()}`,
        DefaultRootObject: '',
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: `S3-${config.S3_BUCKET}`,
              DomainName: getS3WebsiteEndpoint(config.S3_REGION, config.S3_BUCKET),
              OriginPath: '',
              CustomHeaders: {
                Quantity: 0,
                Items: []
              },
              CustomOriginConfig: {
                HTTPPort: 80,
                HTTPSPort: 443,
                OriginProtocolPolicy: 'http-only',
                OriginSslProtocols: {
                  Quantity: 3,
                  Items: [
                    'TLSv1',
                    'TLSv1.1',
                    'TLSv1.2'
                  ]
                }
              }
            }
          ]
        },
        DefaultCacheBehavior: {
          TargetOriginId: `S3-${config.S3_BUCKET}`,
          ForwardedValues: {
            QueryString: false,
            Cookies: {
              Forward: 'none'
            },
            Headers: {
              Quantity: 0,
              Items: []
            },
            QueryStringCacheKeys: {
              Quantity: 0,
              Items: []
            }
          },
          TrustedSigners: {
            Enabled: false,
            Quantity: 0,
            Items: []
          },
          ViewerProtocolPolicy: 'allow-all',
          MinTTL: 0,
          AllowedMethods: {
            Quantity: 2,
            Items: [
              'HEAD',
              'GET'
            ],
            CachedMethods: {
              Quantity: 2,
              Items: [
                'HEAD',
                'GET'
              ]
            }
          },
          SmoothStreaming: false,
          DefaultTTL: 0,
          MaxTTL: 0,
          Compress: true
        },
        CacheBehaviors: {
          Quantity: 1,
          Items: [
            {
              PathPattern: 'assets/*',
              TargetOriginId: `S3-${config.S3_BUCKET}`,
              ForwardedValues: {
                QueryString: false,
                Cookies: {
                  Forward: 'none'
                },
                Headers: {
                  Quantity: 0,
                  Items: []
                },
                QueryStringCacheKeys: {
                  Quantity: 0,
                  Items: []
                }
              },
              TrustedSigners: {
                Enabled: false,
                Quantity: 0,
                Items: []
              },
              ViewerProtocolPolicy: 'allow-all',
              MinTTL: 0,
              AllowedMethods: {
                Quantity: 2,
                Items: [
                  'HEAD',
                  'GET'
                ],
                CachedMethods: {
                  Quantity: 2,
                  Items: [
                    'HEAD',
                    'GET'
                  ]
                }
              },
              SmoothStreaming: false,
              DefaultTTL: 86400,
              MaxTTL: 31536000,
              Compress: true
            }
          ]
        },
        CustomErrorResponses: {
          Quantity: 0,
          Items: []
        },
        Comment: '',
        Logging: {
          Enabled: false,
          IncludeCookies: false,
          Bucket: '',
          Prefix: ''
        },
        PriceClass: 'PriceClass_All',
        Enabled: true,
        WebACLId: '',
        HttpVersion: 'http2'
      }
    }, (err, data) => {
      if (err) {
        console.log(colors.red('Failed to create CloudFront distribution'))
        reject(err)
      } else {
        console.log(colors.green('Successfully created CloudFront distribution with Id:'), data.Id)
        config.CLOUDFRONT_DISTRIBUTION_ID = data.Id
        console.log(`Deploying https://${data.DomainName} - ready in approximately 15 minutes ☕️`)
        resolve()
      }
    })
  })
}

function createUserPool () {
  return new Promise((resolve, reject) => {
    cognitoServiceProvider.createUserPool({
      PoolName: config.S3_BUCKET,
      AliasAttributes: ['phone_number'],
      AutoVerifiedAttributes: ['email'],
      Policies: {
        PasswordPolicy: {
          MinimumLength: 6,
          RequireLowercase: true,
          RequireNumbers: false,
          RequireSymbols: false,
          RequireUppercase: false
        }
      }
      // Custom messages, more security etc can be defined here
    }, (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log('Successfully created user pool')
        config.COGNITO_USER_POOL_ID = data.UserPool.Id
        resolve(data.UserPool)
      }
    })
  })
}

function createUserPoolClient (userPool) {
  return new Promise((resolve, reject) => {
    console.log('Creating user pool client (app) for', userPool.Id, '…')

    cognitoServiceProvider.createUserPoolClient({
      ClientName: config.S3_BUCKET,
      UserPoolId: userPool.Id,
      GenerateSecret: false
    }, (err, data) => {
      if (err) {
        console.log('Failed to create user pool client (app)')
        reject(err)
      } else {
        console.log('Successfully created user pool client with id:', data.UserPoolClient.ClientId)
        config.COGNITO_USER_POOL_CLIENT_ID = data.UserPoolClient.ClientId
        resolve(data.UserPoolClient)
      }
    })
  })
}

function createIdentityPool (userPoolClient) {
  return new Promise((resolve, reject) => {
    cognitoIdentity.createIdentityPool({
      AllowUnauthenticatedIdentities: true,
      IdentityPoolName: COGNITO_FEDERATED_ID_NAME,
      CognitoIdentityProviders: [
        {
          ClientId: userPoolClient.ClientId,
          ProviderName: `cognito-idp.${COGNITO_REGION}.amazonaws.com/${userPoolClient.UserPoolId}`
        }
      ]
    }, (err, data) => {
      if (err) {
        console.log('Failed to create federated identity pool')
        reject(err)
      } else {
        console.log('Successfully created federated identity pool:', data.IdentityPoolId)
        config.COGNITO_IDENTITY_POOL_ID = data.IdentityPoolId
        resolve(data.IdentityPoolId)
      }
    })
  })
}

function createUnauthRole (identityPoolId) {
  return new Promise((resolve, reject) => {
    iam.createRole({
      RoleName: `flatpackCLI_Cognito_${COGNITO_FEDERATED_ID_NAME}Unauth_Role`,
      AssumeRolePolicyDocument: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Federated": "cognito-identity.amazonaws.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
              "StringEquals": {
                "cognito-identity.amazonaws.com:aud": "${identityPoolId}"
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "unauthenticated"
              }
            }
          }
        ]
      }`
    }, (err, data) => {
      if (err) {
        console.log('Failed to create unauth role')
        reject(err)
      } else {
        console.log('Successfully created unauth role:', data.Role.RoleName, data.Role.RoleId)
        console.log('Creating inline policy…')
        iam.putRolePolicy({
          RoleName: data.Role.RoleName,
          PolicyName: `flatpackCLI_Cognito_${COGNITO_FEDERATED_ID_NAME}Unauth_Role_${Date.now()}`,
          PolicyDocument: `{
            "Version": "2012-10-17",
            "Statement": [
              {
                "Effect": "Allow",
                "Action": [
                  "mobileanalytics:PutEvents",
                  "cognito-sync:*"
                ],
                "Resource": [
                  "*"
                ]
              }
            ]
          }`
        }, (err) => {
          if (err) {
            console.log('Failed to create inline policy:')
            reject(err)
          } else {
            console.log('Successfully created inline policy')
            resolve({ identityPoolId, unauthArn: data.Role.Arn })
          }
        })
      }
    })
  })
}

function createAuthRole ({ identityPoolId, unauthArn }) {
  return new Promise((resolve, reject) => {
    iam.createRole({
      RoleName: `flatpackCLI_Cognito_${COGNITO_FEDERATED_ID_NAME}Auth_Role`,
      AssumeRolePolicyDocument: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Federated": "cognito-identity.amazonaws.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
              "StringEquals": {
                "cognito-identity.amazonaws.com:aud": "${identityPoolId}"
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "authenticated"
              }
            }
          }
        ]
      }`
    }, (err, data) => {
      if (err) {
        console.log('Failed to create auth role')
        reject(err)
      } else {
        console.log('Successfully created auth role:', data.Role.RoleName, data.Role.RoleId)
        console.log('Creating inline policy')
        iam.putRolePolicy({
          RoleName: data.Role.RoleName,
          PolicyName: `flatpackCLI_Cognito_${COGNITO_FEDERATED_ID_NAME}Auth_Role_${Date.now()}`,
          PolicyDocument: `{
            "Version": "2012-10-17",
            "Statement": [
              {
                "Effect": "Allow",
                "Action": [
                  "mobileanalytics:PutEvents",
                  "cognito-sync:*",
                  "cognito-identity:*"
                ],
                "Resource": [
                  "*"
                ]
              },
              {
                "Effect": "Allow",
                "Action": [
                  "s3:PutObject",
                  "s3:GetObject",
                  "s3:DeleteObject"
                ],
                "Resource": ["arn:aws:s3:::${config.S3_BUCKET}/*"]
              },
              {
                "Effect": "Allow",
                "Action": [
                  "s3:PutBucketWebsite"
                ],
                "Resource": ["arn:aws:s3:::${config.S3_BUCKET}"]
              }
            ]
          }`
        }, (err) => {
          if (err) {
            console.log('Failed to create inline policy')
            reject(err)
          } else {
            console.log('Successfully created inline policy')
            resolve({ identityPoolId, unauthArn, authArn: data.Role.Arn })
          }
        })
      }
    })
  })
}

function setIdentityPoolRoles ({ identityPoolId, unauthArn, authArn }) {
  return new Promise((resolve, reject) => {
    cognitoIdentity.setIdentityPoolRoles({
      IdentityPoolId: identityPoolId,
      Roles: {
        unauthenticated: unauthArn,
        authenticated: authArn
      }
    }, (err, data) => {
      if (err) {
        console.log('Failed to set identity pool roles')
        reject(err)
      } else {
        console.log('Successfully set identity pool roles')
        console.log(data)
        resolve()
      }
    })
  })
}

function createUser () {
  return new Promise((resolve, reject) => {
    prompt.get([{
      name: 'email',
      description: colors.green('Enter your email'),
      required: true
    }, {
      name: 'password',
      hidden: true,
      replace: '•',
      description: colors.green('Enter your password'),
      required: true
    }], (error, result) => {
      if (error) {
        console.error('All fields are required')
      } else {
        cognitoServiceProvider.signUp({
          ClientId: config.COGNITO_USER_POOL_CLIENT_ID,
          Password: result.password,
          Username: result.email,
          UserAttributes: [
            {
              Name: 'email',
              Value: result.email
            }
          ]
        }, (err, data) => {
          if (err) {
            console.log('Failed to create user')
            reject(err.stack)
          } else {
            console.log('Successfully created user', result.email)
            resolve(result.email)
          }
        })
      }
    })
  })
}

function confirmUser (email) {
  return new Promise((resolve, reject) => {
    prompt.get([{
      name: 'code',
      description: colors.green(`Enter your verification code (sent to ${email})`),
      required: true
    }], (error, result) => {
      if (error) {
        console.error('Please enter your verification code')
      } else {
        cognitoServiceProvider.confirmSignUp({
          ClientId: config.COGNITO_USER_POOL_CLIENT_ID,
          ConfirmationCode: result.code,
          Username: email
        }, (err, data) => {
          if (err) {
            console.log('Failed to confirm email address')
            confirmUser(email).then(resolve)
          } else {
            console.log('Email address confirmed')
            resolve()
          }
        })
      }
    })
  })
}

function writeConfigFile () {
  return new Promise((resolve, reject) => {
    const camelCased = mapKeys(config, (val, key) => camelCase(key))
    const contents = JSON.stringify(camelCased, null, 2)

    fs.writeFile(path.join(process.cwd(), 'aws.json'), contents, (err) => {
      if (err) {
        console.log('Could not write aws.json to filesystem')
        reject(err)
      } else {
        console.log('Successfully wrote aws.json to filesystem')
        resolve()
      }
    })
  })
}
