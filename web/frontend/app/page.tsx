import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <h1>Welcome to the Home Page</h1>
      <Link href={"/documents"}>click</Link>
    </div>
  );
}
