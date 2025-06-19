import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  LinearProgress,
  styled,
  keyframes,
  Button,
} from "@mui/material";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  overflow: "visible",
  position: "relative",
  maxWidth: 500,
  margin: "24px auto",
  "&:before": {
    content: '""',
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 17,
    background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    zIndex: -1,
    opacity: 0.7,
  },
}));

const GradientButton = styled(Button)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 12,
  color: "white",
  padding: "8px 24px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  width: "100%",
  marginTop: "16px",
});

const FuelTankTimeCalculator = () => {
  const initialData = {
    currentLevel: "",
    currentVolume: 2608.214,
    inflowRate: "",
    targetLevel: "",
  };

  const [inputs, setInputs] = useState(initialData);
  const [completionTime, setCompletionTime] = useState(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const mmPerM3 = 1603 / 2608.214; // Коэффициент перевода

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateCompletionTime = () => {
    setIsCalculating(true);
    setError("");
    setCompletionTime(null);

    setTimeout(() => {
      try {
        if (!inputs.currentLevel || !inputs.inflowRate || !inputs.targetLevel) {
          throw new Error("Заполните все поля");
        }

        const currentLevel = parseFloat(inputs.currentLevel);
        const inflowRate = parseFloat(inputs.inflowRate);
        const targetLevel = parseFloat(inputs.targetLevel);

        if (targetLevel <= currentLevel) {
          throw new Error("Целевой уровень должен быть выше текущего");
        }

        if (inflowRate <= 0) {
          throw new Error("Скорость поступления должна быть положительной");
        }

        const levelDifference = targetLevel - currentLevel;
        const volumeDifference = levelDifference / mmPerM3;
        const hoursNeeded = volumeDifference / inflowRate;

        const now = new Date();
        const completionDate = new Date(
          now.getTime() + hoursNeeded * 60 * 60 * 1000
        );

        setCompletionTime({
          timeString: completionDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: completionDate.toLocaleDateString(),
          hoursNeeded: hoursNeeded.toFixed(2),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsCalculating(false);
      }
    }, 800); // Искусственная задержка для анимации
  };

  return (
    <Box sx={{ px: 2 }}>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#333",
              textAlign: "center",
              mb: 4,
            }}
          >
            🛢️ Уровень
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Текущий уровень (мм)"
              variant="outlined"
              name="currentLevel"
              value={inputs.currentLevel}
              onChange={handleInputChange}
              type="number"
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: "#f9f9f9" },
              }}
            />

            <TextField
              fullWidth
              label="Скорость поступления (м³/час)"
              variant="outlined"
              name="inflowRate"
              value={inputs.inflowRate}
              onChange={handleInputChange}
              type="number"
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: "#f9f9f9" },
              }}
            />

            <TextField
              fullWidth
              label="Целевой уровень (мм)"
              variant="outlined"
              name="targetLevel"
              value={inputs.targetLevel}
              onChange={handleInputChange}
              type="number"
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: "#f9f9f9" },
              }}
            />
          </Box>

          {isCalculating && (
            <LinearProgress
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 2,
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              }}
            />
          )}

          <GradientButton
            onClick={calculateCompletionTime}
            disabled={isCalculating}
          >
            {isCalculating ? "Вычисляем..." : "Рассчитать"}
          </GradientButton>

          {error && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#ffeeee",
                borderRadius: 12,
                animation: `${fadeIn} 0.3s ease-out`,
              }}
            >
              <Typography color="error" sx={{ textAlign: "center" }}>
                ⚠️ {error}
              </Typography>
            </Box>
          )}

          {completionTime && !error && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                backgroundColor: "#f8f9fa",
                borderRadius: 12,
                borderLeft: "4px solid #FE6B8B",
                animation: `${fadeIn} 0.5s ease-out`,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Результат расчета:
              </Typography>
              <Typography>
                Целевой уровень будет достигнут в{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "#FE6B8B" }}
                >
                  {completionTime.timeString}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
                (Через ~{completionTime.hoursNeeded} часов)
              </Typography>
            </Box>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default FuelTankTimeCalculator;
