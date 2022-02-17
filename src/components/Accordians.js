import React, { Component, useState } from "react";
import { Accordion, Icon, Table, Message, Pagination, Container, Segment, GridColumn, Grid } from "semantic-ui-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import moment from "moment"

export const Accordians = ({
  plotOptions,
  plotData,
  results,
  tableHeaders,
  activePage,
  onPageChange,
  itemsPerPage,
}) => {
  const [accordianIndex, setAccordianIndexState] = useState({ activeIndex: -1 });

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = accordianIndex;
    const newIndex = activeIndex === index ? -1 : index;

    setAccordianIndexState({ activeIndex: newIndex });
  };

  return (
    <Accordion fluid styled>
      <Accordion.Title
        active={accordianIndex.activeIndex === 0}
        index={0}
        onClick={handleClick}
      >
         <Icon  name= "angle down"
         />
        Display Restaurant Statistics
      </Accordion.Title>
      <Accordion.Content active={accordianIndex.activeIndex === 0}>
        <Bar options={plotOptions} data={plotData} />
      </Accordion.Content>

      <Accordion.Title
        active={accordianIndex.activeIndex === 1}
        index={1}
        onClick={handleClick}
      >
        <Icon  name= "angle down"
         />
        Display Restaurant Data Table
      </Accordion.Title>
      <Accordion.Content active={accordianIndex.activeIndex === 1}>
        <Table >
          <Table.Header>
            <Table.Row>
              {tableHeaders.map((header, index) => {
                return <Table.HeaderCell key = {index}>{header}</Table.HeaderCell>;
              })}
            </Table.Row>
          </Table.Header>

          {results.length > 0 ? (
            <Table.Body>
              {results
                .slice(
                  (activePage - 1) * itemsPerPage,
                  activePage * itemsPerPage
                )
                .map((result, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell> {result.restaurantId}</Table.Cell>
                      <Table.Cell>
                        {moment(result.busDt).format("MM/DD/YYYY")}
                      </Table.Cell>
                      <Table.Cell>
                        {moment(result.orderTime).format("h:mm a")}
                      </Table.Cell>
                      <Table.Cell>{result.orderNumber}</Table.Cell>
                      <Table.Cell>
                        $
                        {(Math.round(result.totalAmount * 100) / 100).toFixed(
                          2
                        )}{" "}
                      </Table.Cell>
                      <Table.Cell>
                        ${(Math.round(result.netAmount * 100) / 100).toFixed(2)}
                      </Table.Cell>
                      <Table.Cell>{result.itemSoldQty}</Table.Cell>
                      <Table.Cell>{result.beverageQty}</Table.Cell>
                      <Table.Cell>${result.discountAmount}</Table.Cell>
                      <Table.Cell>
                        {(
                          Math.round(result.discountRatio * 10000) / 100
                        ).toFixed(2)}
                        %
                      </Table.Cell>
                      <Table.Cell>${result.itemDeletedAmount}</Table.Cell>
                      <Table.Cell>${result.refundAmount}</Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          ) : (
              
              <Message size = "tiny"  warning>
                <Message.Header>No restaurant data found</Message.Header>
                <p>Check your search parameters again</p>
              </Message>
              
            
          )}
        </Table>
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
      </Accordion.Content>
    </Accordion>
  );
};

export default Accordians;