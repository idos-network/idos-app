export default function BankIcon({
    className,
    isActive,
    ...props
}: {
    className?: string;
    isActive?: boolean;
}) {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path fill={
                isActive ? 'var(--color-aquamarine-400)' : 'var(--color-neutral-200)'
            } d="M2.79167 13.1667V6.91667H4.04167V13.1667H2.79167ZM7.375 13.1667V6.91667H8.625V13.1667H7.375ZM0.307709 16.0833V14.8333H15.6923V16.0833H0.307709ZM11.9583 13.1667V6.91667H13.2083V13.1667H11.9583ZM0.307709 5.25V4.06417L8 0.298126L15.6923 4.06417V5.25H0.307709ZM3.26271 4H12.7373L8 1.70833L3.26271 4Z" />
        </svg>

    )
}
