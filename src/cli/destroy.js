const AWS = require('aws-sdk')
const prompt = require('prompt')
const colors = require('colors/safe')

// const configPath = require('../config/path')
// const configDefaults = require('../config/defaults')
//
// const config = configDefaults(require(configPath))

const config = { aws: {} }

let credentials = {}

const COGNITO_REGION = 'eu-west-1'

const {
  s3Bucket,
  s3Region,
  cognitoIdentityPoolId,
  cognitoUserPoolId,
  cognitoUserPoolClientId,
  cloudFrontDistributionId
} = config.aws

module.exports = function destroy () {
  initialPrompt()
    .then(teardownCognito)
    .then(emptyBucket)
    .then(deleteBucket)
    .then(disableCloudFrontDistribution)
    // .then(deleteCloudFrontDistribution)
    .then(finalMessage)
    .catch(err => {
      console.log(err)
    })
}

function initialPrompt () {
  return new Promise((resolve, reject) => {
    prompt.message = '💥 '
    console.log(
      colors.red('Warning'),
      'this will remove the AWS configuration for your installation and delete the contents of your S3 bucket.'
    )
    prompt.get([{
      name: 'AWS_ACCESS_KEY_ID',
      description: colors.green('Enter your AWS_ACCESS_KEY_ID'),
      required: true
    }, {
      name: 'AWS_SECRET_ACCESS_KEY',
      description: colors.green('Enter your AWS_SECRET_ACCESS_KEY'),
      required: true
    }], (error, result) => {
      if (error) {
        console.error(colors.red('All fields are required'))
      } else {
        credentials = {
          accessKeyId: result.AWS_ACCESS_KEY_ID,
          secretAccessKey: result.AWS_SECRET_ACCESS_KEY
        }
        resolve()
      }
    })
  })
}

function teardownCognito () {
  return deleteUserPoolClient()
    .then(deleteUserPool)
    .then(deleteRoles)
    .then(deleteIdentityPool)
}

function deleteUserPoolClient () {
  return new Promise((resolve, reject) => {
    const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
      credentials,
      region: COGNITO_REGION
    })
    cognitoServiceProvider.deleteUserPoolClient({
      ClientId: cognitoUserPoolClientId,
      UserPoolId: cognitoUserPoolId
    }, (err, data) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          console.log('User pool client (app) not found, ignoring…')
          resolve()
        } else {
          console.log('Failed to delete user pool client')
          reject(err)
        }
      } else {
        console.log('Successfully deleted user pool client')
        resolve()
      }
    })
  })
}

function deleteUserPool () {
  return new Promise((resolve, reject) => {
    const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
      credentials,
      region: COGNITO_REGION
    })
    cognitoServiceProvider.deleteUserPool({
      UserPoolId: cognitoUserPoolId
    }, (err, data) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          console.log('User pool not found, ignoring…')
          resolve()
        } else {
          console.log('Failed to delete user pool')
          reject(err)
        }
      } else {
        console.log('Successfully deleted user pool')
        resolve()
      }
    })
  })
}

function deleteRoles () {
  return new Promise((resolve, reject) => {
    const cognitoIdentity = new AWS.CognitoIdentity({
      credentials,
      region: COGNITO_REGION
    })
    cognitoIdentity.getIdentityPoolRoles({
      IdentityPoolId: cognitoIdentityPoolId
    }, (err, data) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          console.log('Identity pool not found, ignoring…')
          resolve()
        } else {
          console.log(err)
          reject(err)
        }
      } else {
        if (data.Roles) {
          const unauthRoleName = data.Roles.unauthenticated.split('/')[1]
          const authRoleName = data.Roles.authenticated.split('/')[1]

          Promise.all([
            deleteRolePolicies(unauthRoleName),
            deleteRolePolicies(authRoleName)
          ]).then(() => (
            Promise.all([
              deleteRole(authRoleName),
              deleteRole(unauthRoleName)
            ])
          )).then(resolve).catch(reject)
        } else {
          console.log('No auth or unauth roles found, ignoring…')
          resolve()
        }
      }
    })
  })

  function deleteRolePolicies (roleName) {
    return new Promise((resolve, reject) => {
      const iam = new AWS.IAM({
        credentials,
        region: COGNITO_REGION
      })
      iam.listRolePolicies({
        RoleName: roleName
      }, (err, data) => {
        if (err) {
          if (err.code === 'NoSuchEntity') {
            console.log('Failed to list policies, role not found, ignoring…')
            resolve()
          } else {
            console.log('Failed to list role policies')
            reject(err)
          }
        } else {
          Promise.all(data.PolicyNames.map(policyName => deletePolicy(policyName, roleName)))
            .then(resolve)
            .catch(reject)
        }
      })
    })
  }

  function deletePolicy (policyName, roleName) {
    return new Promise((resolve, reject) => {
      const iam = new AWS.IAM({
        credentials,
        region: COGNITO_REGION
      })
      iam.deleteRolePolicy({
        RoleName: roleName,
        PolicyName: policyName
      }, (err, data) => {
        if (err) {
          console.log('Failed to delete role policy')
          reject(err)
        } else {
          console.log('Successfully deleted role policy', policyName)
          resolve()
        }
      })
    })
  }

  function deleteRole (roleName) {
    return new Promise((resolve, reject) => {
      const iam = new AWS.IAM({
        credentials,
        region: COGNITO_REGION
      })
      iam.deleteRole({
        RoleName: roleName
      }, (err, data) => {
        if (err) {
          if (err.code === 'NoSuchEntity') {
            console.log('Role not found, ignoring…')
            resolve()
          } else {
            console.log('Failed to delete role:', roleName)
            reject(err)
          }
        } else {
          console.log('Successfully deleted role', roleName, data)
          resolve()
        }
      })
    })
  }
}

function deleteIdentityPool () {
  return new Promise((resolve, reject) => {
    const cognitoIdentity = new AWS.CognitoIdentity({
      credentials,
      region: COGNITO_REGION
    })
    cognitoIdentity.deleteIdentityPool({
      IdentityPoolId: cognitoIdentityPoolId
    }, (err, data) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          console.log('Identity pool not found, ignoring…')
          resolve()
        } else {
          console.log('Failed to delete identity pool:', cognitoIdentityPoolId)
          reject(err)
        }
      } else {
        console.log('Successfully deleted identity pool:', cognitoIdentityPoolId)
        resolve()
      }
    })
  })
}

function disableCloudFrontDistribution () {
  return new Promise((resolve, reject) => {
    const cloudFront = new AWS.CloudFront({
      credentials
    })

    cloudFront.getDistributionConfig({
      Id: cloudFrontDistributionId
    }, (err, data) => {
      const distributionETag = data.ETag

      if (err) {
        console.log('Failed to get CloudFront distribution')
        console.log(err.message)
        reject()
      } else {
        const distributionConfig = data.DistributionConfig

        if (distributionConfig.Enabled === true) {
          distributionConfig.Enabled = false

          cloudFront.updateDistribution({
            Id: cloudFrontDistributionId,
            IfMatch: distributionETag,
            DistributionConfig: distributionConfig
          }, (err, data) => {
            if (err) {
              console.log('Failed to disable distribution', err.message)
              reject()
            } else {
              console.log('Successfully disabled distribution:', data.Id)
              resolve()
            }
          })
        } else {
          console.log('CloudFront distribution already disabled…')
          resolve()
        }
      }
    })
  })
}

// TODO: Wait for distribution to be disabled before trying to delete
// function deleteCloudFrontDistribution () {
//   return new Promise((resolve, reject) => {
//     const cloudFront = new AWS.CloudFront({
//       credentials
//     })
//
//     cloudFront.getDistributionConfig({
//       Id: cloudFrontDistributionId
//     }, (err, data) => {
//       const distributionETag = data.ETag
//
//       if (err) {
//         console.log('Failed to delete CloudFront distribution')
//         reject()
//       } else {
//         cloudFront.deleteDistribution({
//           Id: cloudFrontDistributionId,
//           IfMatch: distributionETag
//         }, (err, data) => {
//           if (err) {
//             console.log('Failed to delete CloudFront distribution:', cloudFrontDistributionId)
//             console.log(err.message)
//             reject()
//           } else {
//             console.log('Successfully deleted CloudFront distribution: ', cloudFrontDistributionId)
//             resolve()
//           }
//         })
//       }
//     })
//   })
// }

function emptyBucket () {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({
      credentials,
      region: s3Region
    })
    s3.listObjects({
      Bucket: s3Bucket
    }, (err, data) => {
      if (err) {
        if (err.code === 'NoSuchBucket') {
          console.log('Bucket not found, ignoring…')
          resolve()
        } else {
          reject(err)
        }
      } else {
        console.log(`Bucket contains ${data.Contents.length} objects, deleting…`)
        Promise.all(data.Contents.map(deleteObject))
          .then(resolve)
          .catch(reject)
      }
    })
  })
}

function deleteBucket () {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({
      credentials,
      region: s3Region
    })
    s3.deleteBucket({
      Bucket: s3Bucket
    }, (err, data) => {
      if (err) {
        if (err.code === 'NoSuchBucket') {
          console.log('Bucket not found, ignoring…')
          resolve()
        } else {
          console.log('Failed to delete bucket', s3Bucket)
          reject(err)
        }
      } else {
        console.log('Successfully deleted bucket', s3Bucket)
        resolve()
      }
    })
  })
}

function deleteObject (object) {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({
      credentials,
      region: s3Region
    })
    s3.deleteObject({
      Bucket: s3Bucket,
      Key: object.Key
    }, (err, data) => {
      if (err) {
        console.log('Failed to delete object', object.Key)
        reject(err)
      } else {
        console.log(colors.red('Deleted'), object.Key)
        resolve()
      }
    })
  })
}

function finalMessage () {
  console.log(colors.green('Flatpack finished cleaning up'), s3Bucket)
}
