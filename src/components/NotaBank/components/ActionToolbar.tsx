import { BuyIcon, ReceiveIcon, SellIcon, SendIcon } from '@/components/icons';
import { Link } from '@tanstack/react-router';
import type React from 'react';
import { Fragment } from 'react';
import { ReceiveTokenDialog } from './ReceiveTokenDialog';
import { SendTokensDialog } from './SendTokensDialog';

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
    id: 'sell',
    label: 'Sell',
    icon: <SellIcon />,
  },
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
            <Fragment key={action.id}>
              {action.render ? (
                action.render()
              ) : (
                <Link
                  to={`/notabank/${action.id as 'buy'}`}
                  activeProps={{
                    className: 'bg-[#74FB5B]!',
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-105 bg-white/90 text-black hover:bg-white"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </Link>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
