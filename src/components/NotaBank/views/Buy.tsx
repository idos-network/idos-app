import UserBalance from '../components/UserBalance';
import ActionToolbar from '../components/ActionToolbar';
import { BuyTokens } from '../components';
import ProviderQuotes from '../components/ProviderQuotes';

export default function Buy() {
    return (
        <div className="flex flex-col justify-center w-full md:px-[120px]">
            <div className="flex justify-between items-center w-full">
                <UserBalance />
                <ActionToolbar />
            </div>

            <div className="mt-10 flex justify-between gap-5 w-full">
                <BuyTokens />
                <ProviderQuotes />
            </div>
        </div>
    );
}