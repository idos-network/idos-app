import type React from 'react';
import {
  BridgeIcon,
  BuyIcon,
  ReceiveIcon,
  SellIcon,
  SendIcon,
  SwapIcon,
} from '@/components/icons';
import { Link } from '@tanstack/react-router';
import { SendTokensDialog } from './SendTokensDialog';
import { ReceiveTokenDialog } from './ReceiveTokenDialog';

interface ActionButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  render?: () => React.ReactNode;
}

const actionButtons: ActionButton[] = [
  {
    id: 'buy',
    label: 'Buy',
    icon: <BuyIcon />,
    isActive: true,
  },
  {
    id: 'buy',
    label: 'Sell',
    icon: <SellIcon />,
  },
  // {
  //   id: "swap",
  //   label: "Swap",
  //   icon: <SwapIcon />,
  // },
  // {
  //   id: "bridge",
  //   label: "Bridge",
  //   icon: <BridgeIcon />,
  // },
  {
    id: 'send',
    label: 'Send',
    icon: <SendIcon />,
    render: () => <SendTokensDialog />,
  },
  {
    id: 'receive',
    label: 'Receive',
    icon: <ReceiveIcon />,
    render: () => <ReceiveTokenDialog />,
  },
];

export default function ActionToolbar() {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          {actionButtons.map((action) => (
            <>
              {action.render ? action.render() : <Link
                key={action.id}
                to={`/notabank/${action.id as "buy"}`}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-105 ${action.isActive
                  ? 'bg-green-400 text-black hover:bg-green-500'
                  : 'bg-white/90 text-black hover:bg-white'
                  }`}
              >
                {action.icon}
                <span>{action.label}</span>
              </Link>}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
