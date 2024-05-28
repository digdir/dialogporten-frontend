// param customDomainVerificationId string
param testprefix string = 'testprefix' // Replace with actual value or parameter
// param namePrefix string = 'namePrefix' // Replace with actual value or parameter

resource dns_zone 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: 'af.at.altinn.cloud'

  resource cname 'CNAME@2018-05-01' = {
    name: 'test'
    properties: {
      TTL: 3600
      CNAMERecord: {
        cname: testprefix
      }
    }
  }

  resource verification 'TXT@2018-05-01' = {
    name: 'asuid.test'
    properties: {
      TTL: 3600
      TXTRecords: [
        {
          value: ['customDomainVerificationId']
        }
      ]
    }
  }
}
