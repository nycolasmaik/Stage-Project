const DataTable = ({ data, onEdit, onDelete, onCreateProcess, onListProcesses }) => {
  if (!data || data.length === 0) return <p>Nenhum dado encontrado.</p>;
  const columns = Object.keys(data[0]);

  return (
    <div className="grid-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((key) => (
              <th key={key}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
            ))}
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((key) => (
                <td key={key}>{String(item[key])}</td>
              ))}
              <td style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-action btn-outline" onClick={() => onEdit(item)} title="Editar">✏️</button>
                <button className="btn-action btn-danger" onClick={() => onDelete(item)} title="Excluir">🗑️</button>
                <button className="btn-action btn-success" onClick={() => onCreateProcess(item.id)} title="Novo Processo">➕</button>
                <button className="btn-action" style={{backgroundColor: '#0ea5e9', color: 'white'}} onClick={() => onListProcesses(item.id)} title="Ver Processos">📂</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DataTable;