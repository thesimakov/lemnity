import React from "react";
import StatsCard from "./StatsCard";
import iconWallet from "../../assets/icons/wallet.svg";
import iconBriefcase from "../../assets/icons/briefcase.svg";
import iconUser from "../../assets/icons/user.svg";
import iconClock from "../../assets/icons/clock.svg";
import "./Stats.css";
import { Select, SelectItem } from "@heroui/select";

const statsCards = [
  {
    title: "Ваш баланс",
    amount: 100,
    currency: "р.",
    tip: "Рекомендуем пополнить кошелек",
    icon: iconWallet,
    iconColor: "text-orange-500",
  },
  {
    title: "Проекты",
    amount: 3,
    maxAmount: 3,
    icon: iconBriefcase,
    iconColor: "text-green-500",
  },
  {
    title: "Посетители",
    amount: 0,
    maxAmount: 100,
    icon: iconUser,
    iconColor: "text-purple-500",
  },
  {
    title: "Партнерская программа",
    amount: 0,
    currency: "руб.",
    icon: iconClock,
    iconColor: "text-blue-500",
  },
];

const Stats: React.FC = () => {
  const getPeriodSelector = () => {
    return (
      <Select
        size="sm"
        className="max-w-[200px]"
        placeholder="Выберите период"
        defaultSelectedKeys={["1"]}
      >
        <SelectItem key="1">За последние 24 часа</SelectItem>
        <SelectItem key="7">За последние 30 дней</SelectItem>
        <SelectItem key="30">За весь период</SelectItem>
      </Select>
    );
  };

  const getStatsCards = () => {
    return statsCards.map((card) => (
      <StatsCard
        key={card.title}
        title={card.title}
        amount={card.amount}
        maxAmount={card.maxAmount}
        currency={card.currency}
        tip={card.tip}
        icon={card.icon}
        isNegative={card.title == "Ваш баланс"}
        iconColor={card.iconColor}
      />
    ));
  };

  return (
    <div className="flex flex-col justify-between h-full gap-5">
      <div className="flex flex-row justify-between items-center w-full">
        <h2 className="text-xl font-roboto">Статистика</h2>
        {getPeriodSelector()}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 sm:gap-1 md:gap-2 lg:gap-3">
        {getStatsCards()}
      </div>
    </div>
  );
};

export default Stats;
