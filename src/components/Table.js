import React from "react";
import moment from "moment";
import "semantic-ui-css/semantic.min.css";
import { Pagination, Icon } from "semantic-ui-react";
export const Table = ({ results, activePage, onPageChange, itemsPerPage }) => {
  return (
    <>
      {results.length > 0 ? (
        <Pagination
          size="small"
          defaultActivePage={activePage}
          onPageChange={(e, data) => onPageChange(data)}
          ellipsisItem={{
            content: <Icon name="ellipsis horizontal" />,
            icon: true,
          }}
          firstItem={{
            content: <Icon name="arrow left" />,
            icon: true,
          }}
          lastItem={{
            content: <Icon name="arrow right" />,
            icon: true,
          }}
          prevItem={null}
          nextItem={null}
          totalPages={Math.ceil(results.length / itemsPerPage)}
        />
      ) : null}
      <table className="ui celled table">
        <thead>
          
          <tr>
            <th>Restaurand Id</th>
            <th>Transaction Date</th>
            <th>Transaction Time</th>
            <th>Ticket Number</th>
            <th>Transaction Total Amount $</th>
            <th>Transaction Net Amount $</th>
            <th>Items Sold #</th>
            <th>Beverages Sold #</th>
            <th>Transaction Discount Amount $</th>
            <th>Transaction Discount Ratio %</th>
            <th>Item Deleted Amount $</th>
            <th>Transaction Refund Amount $</th>
          </tr>
        </thead>
        {results.length > 0 ?
        <tbody>
          {results
            .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
            .map((result, index) => {
              return (
                <tr key={index}>
                  <td> {result.restaurantId}</td>
                  <td>{moment(result.busDt).format("MM/DD/YYYY")}</td>
                  <td>{moment(result.orderTime).format("h:mm a")}</td>
                  <td>{result.orderNumber}</td>
                  <td>${(Math.round(result.totalAmount * 100) / 100).toFixed(
                      2)} </td>
                  <td>${(Math.round(result.netAmount * 100) / 100).toFixed(
                      2)}</td>
                  <td>{result.itemSoldQty}</td>
                  <td>{result.beverageQty}</td>
                  <td>${result.discountAmount}</td>
                  <td>
                    {(Math.round(result.discountRatio * 10000) / 100).toFixed(
                      2
                    )}
                    %
                  </td>
                  <td>{result.itemDeletedAmount}</td>
                  <td>${result.refundAmount}</td>
                </tr>
              );
            })} 
        </tbody>: null
}
      </table>
    </>
  );
};

export default Table;
