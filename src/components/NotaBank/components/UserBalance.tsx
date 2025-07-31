export const trimAddress = (addr: string | undefined) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-5)}`;
};

export default function UserBalance() {

  return (
    <div className="flex items-center gap-6 bg-black">
      <div className="flex flex-col gap-2">
        <div className=" text-3xl text-white md:text-6xl">$12,340.56</div>
      </div>
    </div>
  );
}
