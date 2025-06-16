export default function SearchResultCard({ card, onAdd, onRemove }) {


    return (
        <div className="card-container">
            <li>
                <img src={card.image_uris.normal} alt={card.name} />
            </li>
            <button className="card-action-button" onClick={() => onAdd(card)}>
                Add card to deck
            </button>
            <button className="card-action-button" onClick={() => onRemove(card)}>
                Remove from search
            </button>
        </div>
    )
}