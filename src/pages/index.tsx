import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { type HTMLAttributes, useState, type ReactNode } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const [createdSnip, setCreatedSnip] = useState<Snip | undefined>(undefined);

  return (
    <>
      <Head>
        <title>Snipma Link</title>
        <meta name="description" content="Link shortening website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen flex-col bg-background text-foreground">
        <div className="container mx-auto h-full w-full">
          <Header />
          <div className="mx-auto flex max-w-[1000px] flex-col justify-around gap-16 pt-16">
            <UrlInput setCreatedSnip={setCreatedSnip} />
            <SnipOutputView snip={createdSnip} />
          </div>
        </div>
      </div>
    </>
  );
}

import { type FC } from "react";
import Loading from "~/components/Loading";
import { getSnipEndUrl } from "~/utils/snipUtils";
import CopyToClipboard1 from "~/components/CopyToClipboard";
import { useToast } from "~/components/Toast/ToastContext";

interface SnipOutputViewProps {
  snip?: Snip;
}

const SnipOutputView: FC<SnipOutputViewProps> = ({ snip }) => {
  return (
    <Display className="overflow-hidden bg-white">
      {snip && (
        <ClickToCopy className="flex h-full w-full items-center pl-12">
          {getSnipEndUrl(snip)}
        </ClickToCopy>
      )}
    </Display>
  );
};

const ClickToCopy = (
  props: {
    children: string;
  } & HTMLAttributes<HTMLDivElement>,
) => {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="relative h-full w-full cursor-pointer"
      onClick={() => {
        void navigator.clipboard.writeText(props.children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      <div {...props}>{props.children}</div>

      <div
        className={`translate absolute right-16 top-1/2 -translate-y-1/2 ${copied && "text-sm text-muted-foreground"}`}
      >
        {copied ? "Copied!" : <CopyToClipboard1 size={50} />}
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="h-32 w-full border-b bg-gradient-to-b from-background to-transparent">
      <div className="flex h-full items-center justify-center">
        <div className="text-5xl">Snipma Link ✂️</div>
      </div>
    </header>
  );
};

export interface Snip {
  url: string;
  short: string;
}

const UrlInput = (props: { setCreatedSnip: (snip: Snip) => void }) => {
  const toast = useToast();
  const create = api.snip.create.useMutation({
    onSuccess: (res) => {
      setUrl("");
      props.setCreatedSnip(res.snip);
    },
    onError: () => {
      toast?.create("Something went wrong :(", "error");
    },
  });
  const [url, setUrl] = useState("");

  return (
    <div className="flex h-full">
      <form className="relative w-full">
        <Display className="overflow-hidden">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-full w-full pl-10 outline-none"
            placeholder="Your URL"
          ></input>
        </Display>
        <button
          className="absolute right-0 top-1/2 flex h-full w-24 -translate-y-1/2 transform items-center justify-center rounded-lg rounded-r-full bg-primary text-primary-foreground hover:bg-primary/80 active:bg-primary/90 md:w-48"
          onClick={async (e) => {
            e.preventDefault();
            if (!url.startsWith("http")) {
              await create.mutateAsync({ url: "https://" + url });
              return;
            }
            await create.mutateAsync({ url });
          }}
        >
          {create.isPending ? <Loading size={60} /> : "GO"}
        </button>
      </form>
      {/* {create.isError && (
        <div>An error occurred: {create.error.data?.code}</div>
      )} */}
    </div>
  );
};

const Display = (
  props: {
    children: React.ReactNode;
    className?: string;
  } & HTMLAttributes<HTMLDivElement>,
) => {
  return (
    <div
      className={`h-24 w-full rounded-full border-2 border-border text-4xl ${props.className}`}
    >
      {props.children}
    </div>
  );
};
