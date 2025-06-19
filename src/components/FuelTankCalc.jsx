import React, { useState, useEffect } from "react";

const FuelTankTimeCalculator = () => {
  // Исходные данные
  const initialData = {
    currentLevel: 1603, // текущий уровень в мм
    currentVolume: 2608.214, // текущий объем в м³
    inflowRate: 335, // поступление в м³/час
    targetLevel: 1800, // целевой уровень в мм
  };

  const [inputs, setInputs] = useState(initialData);
  const [completionTime, setCompletionTime] = useState(null);
  const [error, setError] = useState("");

  // Вычисляем коэффициент мм/м³
  const mmPerM3 = initialData.currentLevel / initialData.currentVolume;

  // Обработчик изменения полей ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseFloat(value) || 0,
    }));
  };

  // Вычисление времени достижения целевого уровня
  const calculateCompletionTime = () => {
    // Если какое-то поле пустое, не производим расчет
    if (
      inputs.currentLevel === "" ||
      inputs.inflowRate === "" ||
      inputs.targetLevel === ""
    ) {
      setCompletionTime(null);
      return;
    }

    const currentLevel = parseFloat(inputs.currentLevel);
    const inflowRate = parseFloat(inputs.inflowRate);
    const targetLevel = parseFloat(inputs.targetLevel);

    // Проверка корректности данных
    if (targetLevel <= currentLevel) {
      setError("Целевой уровень должен быть выше текущего");
      setCompletionTime(null);
      return;
    }

    if (inflowRate <= 0) {
      setError("Скорость поступления должна быть положительной");
      setCompletionTime(null);
      return;
    }

    setError("");

    // Вычисляем необходимый прирост объема
    const levelDifference = targetLevel - currentLevel;
    const volumeDifference = levelDifference / mmPerM3;

    // Вычисляем время в часах
    const hoursNeeded = volumeDifference / inflowRate;

    // Получаем текущее время
    const now = new Date();
    // Добавляем необходимое время
    const completionDate = new Date(
      now.getTime() + hoursNeeded * 60 * 60 * 1000
    );

    // Форматируем время в формат ЧЧ:ММ
    const hours = completionDate.getHours().toString().padStart(2, "0");
    const minutes = completionDate.getMinutes().toString().padStart(2, "0");

    setCompletionTime({
      timeString: `${hours}:${minutes}`,
      date: completionDate,
      hoursNeeded: hoursNeeded,
    });
  };

  // Вызываем расчет при изменении входных данных
  useEffect(() => {
    calculateCompletionTime();
  }, [inputs]);

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h2>Калькулятор заполнения резервуара</h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Текущий уровень (мм):
          <input
            type="number"
            name="currentLevel"
            value={inputs.currentLevel}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Поступление мазута (м³/час):
          <input
            type="number"
            name="inflowRate"
            value={inputs.inflowRate}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Целевой уровень (мм):
          <input
            type="number"
            name="targetLevel"
            value={inputs.targetLevel}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </label>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      {completionTime && !error && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          <h3>Результат:</h3>
          <p>Целевой уровень {inputs.targetLevel} мм будет достигнут:</p>
          <p>
            <strong>{completionTime.timeString}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default FuelTankTimeCalculator;
