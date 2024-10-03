import { graphql, HttpResponse } from 'msw';
import { dialogs as mockedDialogs } from './dialogs.tsx';
import {PartyFieldsFragment} from "bff-types-generated";

export const handlers = [
  graphql.query('getAllDialogsForParties', (options) => {
    const { variables: { partyURIs} } = options;
    return HttpResponse.json({
      data: {
        searchDialogs: {
          items: mockedDialogs.filter((dialog) => partyURIs.includes(dialog.party)),
        }
      }
    });
  }),
  graphql.query('parties', () => {
    const parties: PartyFieldsFragment[] = [
      {
        "party": "urn:altinn:person:identifier-no:1",
        "partyType": "Person",
        "subParties": [],
        "isAccessManager": true,
        "isMainAdministrator": false,
        "name": "TEST TESTESEN",
        "isCurrentEndUser": true,
        "isDeleted": false
      },
      {
        "party": "urn:altinn:organization:identifier-no:1",
        "partyType": "Organization",
        "subParties": [],
        "isAccessManager": true,
        "isMainAdministrator": false,
        "name": "Company Name",
        "isCurrentEndUser": true,
        "isDeleted": false
      },
      {
        "party": "urn:altinn:organization:identifier-no:1",
        "partyType": "Organization",
        "subParties": [
          {
            "party": "urn:altinn:organization:identifier-sub:1",
            "partyType": "Organization",
            "isAccessManager": true,
            "isMainAdministrator": true,
            "name": "TESTBEDRIFT AS",
            "isCurrentEndUser": false,
          },
          {
            "party": "urn:altinn:organization:identifier-sub:2",
            "partyType": "Organization",
            "isAccessManager": true,
            "isMainAdministrator": true,
            "name": "TESTBEDRIFT AS AVD OSLO",
            "isCurrentEndUser": false,
          }
        ],
        "isAccessManager": true,
        "isMainAdministrator": true,
        "name": "TESTBEDRIFT AS",
        "isCurrentEndUser": false,
        "isDeleted": false
      }
    ]
    return HttpResponse.json({
        data: {
          parties,
      }
    })
  })
];
