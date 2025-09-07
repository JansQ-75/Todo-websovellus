export default function Row({item,deleteTask}) {
    return (
    
    <li>
        {item.description}
        <button classname='delete-button' onClick={() => deleteTask(item)}>Delete</button>
    </li>
    )
}