import {
  ArrowUpDown,
  BarChart3,
  CircleDollarSign,
  PiggyBank,
  ReceiptText,
  WalletCards,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      id: 1,
      icon: ReceiptText,
      title: "Expense tracking",
      description:
        "Record everyday expenses with categories, dates, payment methods, and notes.",
    },
    {
      id: 2,
      icon: ArrowUpDown,
      title: "Income tracking",
      description:
        "Keep track of salary, freelance income, and other money coming into your accounts.",
    },
    {
      id: 3,
      icon: BarChart3,
      title: "Spending overview",
      description:
        "Understand your spending with clear category breakdowns and financial summaries.",
    },
    {
      id: 4,
      icon: WalletCards,
      title: "Budgets",
      description:
        "Set monthly and category budgets and keep an eye on how much you've used.",
    },
    {
      id: 5,
      icon: PiggyBank,
      title: "Savings goals",
      description:
        "Create savings targets and track your progress toward each goal.",
    },
    {
      id: 6,
      icon: CircleDollarSign,
      title: "Financial reports",
      description:
        "Review your income and expenses across daily, weekly, monthly, and yearly periods.",
    },
  ];

  return (
    <section id="features" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Features
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to understand your spending
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            MoneyMap brings your everyday money tracking into one simple
            workspace.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.id}
                className="bg-white p-6 transition-colors duration-200 hover:bg-slate-50 sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon size={21} strokeWidth={2} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;