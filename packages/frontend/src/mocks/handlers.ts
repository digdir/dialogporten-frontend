import { graphql, HttpResponse } from 'msw';
import { dialogs as mockedDialogs } from './dialogs.tsx';

export const handlers = [
  graphql.query('getAllDialogsForParties', () => {
    return HttpResponse.json({
      data: {
        searchDialogs: {
          items: mockedDialogs
        }
      }
    });
  }),
  graphql.query('parties', () => {
    return HttpResponse.json({
      "data": {
        "parties": [
          {
            "party": "urn:altinn:organization:identifier-no::212475912",
            "partyType": "Person",
            "isAccessManager": true,
            "isMainAdministrator": false,
            "name": "HJELPELINJE ORDINÆR",
            "isCurrentEndUser": true,
            "subParties": []
          },
        ]
      }
    })
  })
];
