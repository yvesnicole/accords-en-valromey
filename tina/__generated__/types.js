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
  mapsLink
  mapsLabel
  ticketLabel
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
export const FestivalPartsFragmentDoc = gql`
    fragment FestivalParts on Festival {
  __typename
  title
  locale
  translationKey
  subtitle
  image
  imageCaption
  body
}
    `;
export const HomepagePartsFragmentDoc = gql`
    fragment HomepageParts on Homepage {
  __typename
  title
  locale
  translationKey
  heroTitle
  heroSubtitle
  introTitle
  introDescription
  nextConcertCtaLabel
}
    `;
export const TicketInfoPartsFragmentDoc = gql`
    fragment TicketInfoParts on TicketInfo {
  __typename
  title
  locale
  translationKey
  sectionTitle
  sectionSubtitle
  discountText
  email
  cards {
    __typename
    title
    text
  }
}
    `;
export const ContactInfoPartsFragmentDoc = gql`
    fragment ContactInfoParts on ContactInfo {
  __typename
  title
  locale
  translationKey
  email
  address
  phone
  mapEmbedUrl
  facebookUrl
  instagramUrl
}
    `;
export const SupportInfoPartsFragmentDoc = gql`
    fragment SupportInfoParts on SupportInfo {
  __typename
  title
  locale
  translationKey
  subtitle
  membershipUrl
  donationUrl
  membershipTitle
  membershipText
  donationTitle
  donationText
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
export const FestivalDocument = gql`
    query festival($relativePath: String!) {
  festival(relativePath: $relativePath) {
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
    ...FestivalParts
  }
}
    ${FestivalPartsFragmentDoc}`;
export const FestivalConnectionDocument = gql`
    query festivalConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: FestivalFilter) {
  festivalConnection(
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
        ...FestivalParts
      }
    }
  }
}
    ${FestivalPartsFragmentDoc}`;
export const HomepageDocument = gql`
    query homepage($relativePath: String!) {
  homepage(relativePath: $relativePath) {
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
    ...HomepageParts
  }
}
    ${HomepagePartsFragmentDoc}`;
export const HomepageConnectionDocument = gql`
    query homepageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomepageFilter) {
  homepageConnection(
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
        ...HomepageParts
      }
    }
  }
}
    ${HomepagePartsFragmentDoc}`;
export const TicketInfoDocument = gql`
    query ticketInfo($relativePath: String!) {
  ticketInfo(relativePath: $relativePath) {
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
    ...TicketInfoParts
  }
}
    ${TicketInfoPartsFragmentDoc}`;
export const TicketInfoConnectionDocument = gql`
    query ticketInfoConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: TicketInfoFilter) {
  ticketInfoConnection(
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
        ...TicketInfoParts
      }
    }
  }
}
    ${TicketInfoPartsFragmentDoc}`;
export const ContactInfoDocument = gql`
    query contactInfo($relativePath: String!) {
  contactInfo(relativePath: $relativePath) {
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
    ...ContactInfoParts
  }
}
    ${ContactInfoPartsFragmentDoc}`;
export const ContactInfoConnectionDocument = gql`
    query contactInfoConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ContactInfoFilter) {
  contactInfoConnection(
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
        ...ContactInfoParts
      }
    }
  }
}
    ${ContactInfoPartsFragmentDoc}`;
export const SupportInfoDocument = gql`
    query supportInfo($relativePath: String!) {
  supportInfo(relativePath: $relativePath) {
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
    ...SupportInfoParts
  }
}
    ${SupportInfoPartsFragmentDoc}`;
export const SupportInfoConnectionDocument = gql`
    query supportInfoConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SupportInfoFilter) {
  supportInfoConnection(
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
        ...SupportInfoParts
      }
    }
  }
}
    ${SupportInfoPartsFragmentDoc}`;
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
    festival(variables, options) {
      return requester(FestivalDocument, variables, options);
    },
    festivalConnection(variables, options) {
      return requester(FestivalConnectionDocument, variables, options);
    },
    homepage(variables, options) {
      return requester(HomepageDocument, variables, options);
    },
    homepageConnection(variables, options) {
      return requester(HomepageConnectionDocument, variables, options);
    },
    ticketInfo(variables, options) {
      return requester(TicketInfoDocument, variables, options);
    },
    ticketInfoConnection(variables, options) {
      return requester(TicketInfoConnectionDocument, variables, options);
    },
    contactInfo(variables, options) {
      return requester(ContactInfoDocument, variables, options);
    },
    contactInfoConnection(variables, options) {
      return requester(ContactInfoConnectionDocument, variables, options);
    },
    supportInfo(variables, options) {
      return requester(SupportInfoDocument, variables, options);
    },
    supportInfoConnection(variables, options) {
      return requester(SupportInfoConnectionDocument, variables, options);
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
      url: "https://content.tinajs.io/2.4/content/406dd4fa-a226-4261-a62a-82c3f213d9cc/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
