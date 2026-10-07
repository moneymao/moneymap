import { ArrowDown, BarChart3, Wallet } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: Wallet,
      title: "Track your money",
      description:
        "Record your income and expenses with categories, dates, and payment methods.",
    },
    {
      id: 2,
      icon: BarChart3,
      title: "Understand your spending",
      description:
        "See where your money goes through clear summaries, categories, and spending trends.",
    },
    {
      id: 3,
      icon: ArrowDown,
      title: "Make better decisions",
      description:
        "Set budgets and savings goals so you can make more informed decisions about your money.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-b border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A clearer way to manage your money
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            MoneyMap turns everyday transactions into a simple picture of your
            financial habits.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Icon size={21} strokeWidth={2} />
                </div>

                <p className="mt-6 text-sm font-medium text-slate-400">
                  0{step.id}
                </p>

                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;