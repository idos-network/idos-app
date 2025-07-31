import { Button } from "@/components/ui/button"

export default function HeroCard({ title, subtitle, buttonText, buttonLink }: {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <div className="mx-auto flex-1">
      <div className="relative overflow-hidden rounded-3xl border border-green-600/40" style={{
        background: `
          linear-gradient(91.71deg, rgba(38, 38, 38, 0.2) -3.43%, rgba(116, 251, 91, 0.2) 97.67%), radial-gradient(73.41% 215.8% at 27.88% 12.72%, rgba(63, 198, 38, 0.363922) 0%, rgba(0, 0, 0, 0.16) 100%) 
        `
      }}>
        {/* <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-green-300/20 rounded-full blur-2xl"></div> */}

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.8) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">

              <h1 className="text-4xl  font-semibold text-white tracking-tight drop-shadow-lg">
                {title}
              </h1>

              <p className="text-lg text-white/90 font-light drop-shadow-md">
                {subtitle}
              </p>
            </div>

            <div className="pt-8">
              <Button
                className="bg-green-400 hover:bg-green-300 text-green-900 font-semibold px-8 py-6 text-lg rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-400/25"
                size="lg"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-3xl shadow-inner shadow-green-500/20 pointer-events-none"></div>

        <div className="absolute inset-0 rounded-3xl border border-green-400/20 pointer-events-none"></div>
      </div>
    </div>
  )
}
