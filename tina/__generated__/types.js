export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const ConcertPartsFragmentDoc = gql`
    fragment ConcertParts on Concert {
  __typename
  title
  date
  locale
  translationKey
  program
  description
  image
  helloAssoLink
}
    `;
export const MusicianPartsFragmentDoc = gql`
    fragment MusicianParts on Musician {
  __typename
  name
  locale
  translationKey
  instrument
  photo
  photoCredit
  bio
}
    `;
export const PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  title
  locale
  translationKey
  subtitle
  body
}
    `;
export const ConcertDocument = gql`
    query concert($relativePath: String!) {
  concert(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ConcertParts
  }
}
    ${ConcertPartsFragmentDoc}`;
export const ConcertConnectionDocument = gql`
    query concertConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ConcertFilter) {
  concertConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ConcertParts
      }
    }
  }
}
    ${ConcertPartsFragmentDoc}`;
export const MusicianDocument = gql`
    query musician($relativePath: String!) {
  musician(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...MusicianParts
  }
}
    ${MusicianPartsFragmentDoc}`;
export const MusicianConnectionDocument = gql`
    query musicianConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: MusicianFilter) {
  musicianConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...MusicianParts
      }
    }
  }
}
    ${MusicianPartsFragmentDoc}`;
export const PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
export const PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    concert(variables, options) {
      return requester(ConcertDocument, variables, options);
    },
    concertConnection(variables, options) {
      return requester(ConcertConnectionDocument, variables, options);
    },
    musician(variables, options) {
      return requester(MusicianDocument, variables, options);
    },
    musicianConnection(variables, options) {
      return requester(MusicianConnectionDocument, variables, options);
    },
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
