import { Button } from "@heroui/button";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

const MaintenancePage = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center gap-6 max-w-lg">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Ведутся технические работы
        </h1>
        <div className="mx-auto flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
        <p className="text-default-500">
          Мы улучшаем сервис и скоро вернёмся. Спасибо за терпение и понимание.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button color="primary" onPress={() => navigate("/")}>
          На главную
        </Button>
        <Button variant="flat" onPress={() => window.location.reload()}>
          Обновить страницу
        </Button>
      </div>
    </div>
  );
};

export default MaintenancePage;
