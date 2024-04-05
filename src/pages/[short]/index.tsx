import { useRouter } from "next/router";
import { type FC } from "react";
import { api } from "~/utils/api";
import { getSnipEndUrl } from "~/utils/snipUtils";

const ShortRedirectPage: FC = ({}) => {
  const router = useRouter();

  const short = router.query.short;
  if (short === undefined || Array.isArray(short)) {
    return <></>;
  }

  console.log(short);

  const res = api.snip.get.useQuery({ short });
  if (res.isError) {
    void router.push("/");
  }

  if (res.isSuccess) {
    window.location.assign(res.data.snip.url);
  }

  return <div>Redirecting you!</div>;
};

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const short = query.short;
//   if (short === undefined || Array.isArray(short)) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   const snip = api.snip.get.useQuery({ short });
//   if (!snip.data) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   const endUrl = getSnipEndUrl(snip.data.snip);

//   return { redirect: { destination: endUrl, permanent: false } };
// };

export default ShortRedirectPage;
