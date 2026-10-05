import React from 'react';
import PropTypes from 'prop-types';

/**
 * Generic DataTable component
 */
export default function DataTable({
  columns = [],
  rows = [],
  caption,
  emptyMessage = 'No data available',
  className = '',
  rowKey = 'id',
}) {
  const getRowKey = (row, index) => {
    if (typeof rowKey === 'function') return rowKey(row, index);
    if (typeof rowKey === 'string' && row[rowKey] !== undefined) return row[rowKey];
    return index;
  };

  return (
    <div className={`overflow-x-auto w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold">
            {columns.map((col) => (
              <th
                key={col.key || col.label}
                scope="col"
                className={`py-3 px-4 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-slate-400 dark:text-slate-500 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {columns.map((col) => {
                  const cellValue = row[col.key];
                  return (
                    <td
                      key={col.key || col.label}
                      className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                    >
                      {col.render ? col.render(cellValue, row, index) : (cellValue !== null && cellValue !== undefined ? cellValue : '—')}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      render: PropTypes.func,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      className: PropTypes.string,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  caption: PropTypes.string,
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};
