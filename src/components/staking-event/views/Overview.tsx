export function Overview() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-light text-white">
          Staking Event Overview
        </h2>
        <p className="text-neutral-400">
          Participate in our staking event to earn rewards. Lock your assets for
          a specified period and receive project tokens as rewards.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">
            Total Value Locked
          </h3>
          <p className="text-2xl font-bold text-blue-400">$0.00</p>
          <p className="text-sm text-neutral-500 mt-1">Across all assets</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">
            Active Participants
          </h3>
          <p className="text-2xl font-bold text-green-400">0</p>
          <p className="text-sm text-neutral-500 mt-1">Unique stakers</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">
            Rewards Distributed
          </h3>
          <p className="text-2xl font-bold text-purple-400">0 IDOS</p>
          <p className="text-sm text-neutral-500 mt-1">Total rewards paid</p>
        </div> */}
      </div>
    </div>
  );
}
