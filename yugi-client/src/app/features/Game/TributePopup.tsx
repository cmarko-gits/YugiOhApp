import { useState } from "react";
import type { Card } from "../../slices/gameSlice";

// 🔹 Popup za izbor tribute karata
interface TributePopupProps {
  availableCards: Card[];
  onConfirm: (selectedIds: number[]) => void;
  onCancel: () => void;
  requiredTributes: number;
}

// ✅ Ispravna verzija
const TributePopup: React.FC<TributePopupProps> = ({
  availableCards,
  onConfirm,
  onCancel,
  requiredTributes,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleCard = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else if (selectedIds.length < requiredTributes) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="tribute-popup">
      <h3>Odaberi {requiredTributes} tribute karte</h3>
      <div className="tribute-cards">
        {availableCards.map((card) => (
          <img
            key={card.id}
            src={card.imageUrl}
            alt={card.name}
            className={selectedIds.includes(card.id) ? "selected" : ""}
            onClick={() => toggleCard(card.id)}
          />
        ))}
      </div>
      <button
        onClick={() => onConfirm(selectedIds)}
        disabled={selectedIds.length !== requiredTributes}
      >
        Potvrdi
      </button>
      <button onClick={onCancel}>Otkaži</button>
    </div>
  );
};

export default TributePopup;
