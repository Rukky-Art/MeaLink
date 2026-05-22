import Badge from "./Badge";

function Table({ columns, data, actions }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left px-5 py-3 text-xs text-gray-400">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              {Object.values(row).map((val, i) => (
                <td key={i} className="px-5 py-3">
                  {val}
                </td>
              ))}

              {actions && (
                <td className="px-5 py-3">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;