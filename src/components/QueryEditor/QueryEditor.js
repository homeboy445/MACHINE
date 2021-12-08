import React, { useState, useEffect, useMemo } from "react";
import "./QueryEditor.css";
import { v4 as uuid } from "uuid";
import { animateScroll as scroll } from "react-scroll";
import csvToJson from "csvtojson";
import dataFile from "../../assets/data.csv";
import Play_Icon from "../../assets/icons/play_arrow.svg";
import Share_Icon from "../../assets/icons/share.svg";
import Download_Icon from "../../assets/icons/download.svg";
import Cancel_Icon from "../../assets/icons/cancel.svg";
import Table_Icon from "../../assets/icons/table.svg";
import Arrow_Down_Icon from "../../assets/icons/arrow_down.svg";

const QueryEditor = () => {
  const [activeQueryIndex, updateActiveIndex] = useState(-1);
  const [masterData, updateData] = useState({});
  const getFilteredResults = (data, value, ObjectKey, getAll = true) => {
    value = value.trim();
    if (data === null || data === []) {
      return (
        <h2>There was an error while running the query. Please try again.</h2>
      );
    }
    try {
      data = [...data];
    } catch (e) {
      data = [];
    }
    return (
      <table id="res_table">
        <tbody>
          <tr>
            {(Object.keys(data[0] || {}) || []).map((item, index) => {
              return <th key={index}>{item}</th>;
            })}
          </tr>
        </tbody>
        {data.map((dataItem, index) => {
          if (dataItem[ObjectKey] !== value && !getAll) {
            return null;
          }
          if (activeQueryIndex !== -1) {
            const main_data = queries;
            main_data[activeQueryIndex].download_data = [dataItem];
            updateQueryData(main_data);
          }
          return (
            <tbody key={index}>
              <tr key={index}>
                {(Object.keys(data[0] || {}) || []).map((item, index) => {
                  return <td key={index}>{dataItem[item]}</td>;
                })}
              </tr>
            </tbody>
          );
        })}
      </table>
    );
  };
  const pre_queries = {
    "select * from customers;": (data) => {
      return getFilteredResults(data, "");
    },
    "select * from customers where contactName": (data, value) => {
      return getFilteredResults(data, value, "contactName", false);
    },
    "select * from customers where companyName": (data, value) => {
      return getFilteredResults(data, value, "companyName", false);
    },
    "select * from customers where city": (data, value) => {
      return getFilteredResults(data, value, "city", false);
    },
    "select * from customers where name": (data, value) => {
      return getFilteredResults(data, value, "name", false);
    },
    "select * from customers where customerId": (data, value) => {
      return getFilteredResults(data, value, "customerID", false);
    },
  };
  const [loadedData, updateloadStatus] = useState(false);
  const [counter, update] = useState(0);
  const [queries, updateQueries] = useState([
    {
      name: "",
      result: null,
      resultTab: false,
      is_error: {
        status: false,
        message: "Something's wrong. Try again later.",
      },
      download_data: {},
    },
  ]);
  const [downloadBar, toggleDownloadBar] = useState({
    index: -1,
    status: false,
  });
  const [tables, updateTables] = useState(["customers"]);
  const [databaseInfoBox, toggelDBInfoBox] = useState(false);
  const [collapsed, updateCollapsed] = useState([true]);
  const [searchBar, updateSearch] = useState("");
  const [searchResults, updateResults] = useState([]);
  const refs = useMemo(() => queries.map(() => React.createRef()), [queries]);

  const saveDataLocally = () => {
    const data = queries[0];
    data.session = localStorage.getItem("session");
    localStorage.setItem(localStorage.getItem("session"), JSON.stringify(data));
  };

  const toggleResultTab = (index, status = false) => {
    let data = queries;
    data[index].resultTab = status;
    updateQueries(data);
    return update((counter + 1) % 10);
  };

  const updateQueryData = (data) => {
    updateQueries(data);
    return update((counter + 1) % 10);
  };

  const extractValueFromQuery = (query) => {
    let eq_symb = query.lastIndexOf("=");
    if (eq_symb === -1) {
      return null;
    } else {
      let value = "";
      for (let i = eq_symb; i < query.length; i++) {
        if (
          query[i].toLowerCase() !== query[i].toUpperCase() ||
          query[i] === " "
        ) {
          value += query[i];
        }
      }
      return value;
    }
  };

  const getDownloadLink = (data, contentType = "application/json") => {
    let main_Data = null;
    toggleDownloadBar({index: -1, status: false});
    if (JSON.stringify(data) === JSON.stringify({})) {
      return data;
    }
    if (contentType === "application/json") {
      main_Data = JSON.stringify(data);
    } else {
      const keys = Object.keys(data[0]);
      main_Data = keys.join(",") + "\n";
      data.map((item) => {
        for (let i = 0; i < keys.length; i++) {
          main_Data += item[keys[i]];
          if (i !== keys.length - 1) {
            main_Data += ",";
          }
        }
        main_Data += "\n";
        return null;
      });
    }
    const blob = new Blob([main_Data], { type: contentType });
    return window.URL.createObjectURL(blob);
  };

  useEffect(() => {
    if (!localStorage.getItem("session")) {
      return (window.location.href = "/");
    }
    const localData = localStorage.getItem(localStorage.getItem("session"));
    if (localData && !loadedData) {
      let parsedData;
      try {
        parsedData = JSON.parse(localData).map((item) => {
          item.result = null;
          item.resultTab = false;
          return item;
        });
        updateQueries(parsedData); //Loading data
      } catch (e) {
        //A fallback in case the value is undefined and the flow of execution managed
        //to get inside of the if block...
      }
      updateloadStatus(true);
    }
    saveDataLocally();
    if (JSON.stringify(masterData) === JSON.stringify({})) {
      fetch(dataFile).then(async (response) => {
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf8");
        const data = decoder.decode(result.value);
        csvToJson()
          .fromString(data)
          .then((response) => {
            if (JSON.stringify(response) === JSON.stringify({})) {
              response = { status: false };
            }
            updateData(response);
            scroll.scrollToTop();
          });
      });
    }
    if (searchBar === "" || tables[0].includes(searchBar)) {
      updateResults(tables);
    } else {
      updateResults([""]);
    }
  }, [queries, masterData, counter, databaseInfoBox, collapsed, searchBar]);

  return (
    <div className="query_editor">
      <div className="site_header">
        <div className="site_header_sub">
          <h1
            className="site_title"
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              cursor: "pointer",
            }}
          >
            MACHINE.
          </h1>
          <h3>sql editor</h3>
        </div>
        <button
          className="new_cell_btn"
          onClick={() => {
            let data = queries;
            data.push({
              name: "",
              result: null,
              resultTab: false,
              is_error: {
                status: false,
                message: "Something's wrong. Try again later.",
              },
              download_data: {},
            });
            updateQueryData(data);
            setTimeout(() => {
              refs[refs.length - 1].current.scrollIntoView();
            }, 100);
          }}
        >
          New cell +
        </button>
      </div>
      <div className="query_list">
        {queries.map((query, index) => {
          return (
            <div key={index} className="query_box">
              <div className="query_edit" ref={refs[index]}>
                <p>[{index + 1}]: </p>
                <input
                  type="text"
                  spellCheck="false"
                  className="query_input"
                  onChange={(e) => {
                    const data = queries;
                    data[index].name = e.target.value;
                    updateQueries(data);
                    update((counter + 1) % 10);
                  }}
                  value={query.name}
                  style={{
                    border: query.is_error.status
                      ? "1px solid red"
                      : "1px solid grey",
                  }}
                />
                <img
                  src={Play_Icon}
                  alt=""
                  data-tip="run"
                  id="query_icon1"
                  onClick={() => {
                    const data = queries;
                    const query_keys = Object.keys(pre_queries);
                    let mainData = data[index].name;
                    let found = "";
                    query_keys.map((item) => {
                      if (
                        mainData
                          .toLowerCase()
                          .lastIndexOf(item.toLowerCase()) !== -1
                      ) {
                        found = item;
                      }
                      return null;
                    });
                    if (mainData.lastIndexOf(";") === -1) {
                      found = "";
                    }
                    updateActiveIndex(index);
                    if (found !== "") {
                      let value = extractValueFromQuery(mainData);
                      if (value === null) {
                        data[index].result = pre_queries[found](masterData);
                        data[index].download_data = masterData;
                      } else {
                        data[index].result = pre_queries[found](
                          masterData,
                          value
                        );
                      }
                      data[index].is_error = {
                        status: false,
                        message: "Something's wrong. Try again later.",
                      };
                    } else {
                      data[index].result = null;
                      data[index].is_error = {
                        status: true,
                        message:
                          "The query has syntax error(s), fix it & try again.",
                      };
                      setTimeout(() => {
                        data[index].is_error = {
                          status: false,
                          message: "Something's wrong. Try again later.",
                        };
                        update((counter + 1) % 10);
                      }, 500);
                    }
                    updateQueryData(data);
                    setTimeout(() => updateQueryData(data), 3000);
                    toggleResultTab(index, true);
                  }}
                />
                <img
                  data-tip="share"
                  src={Share_Icon}
                  alt=""
                  id="query_icon2"
                  onClick={() => {
                    if (query.is_error.status || query.result === null) {
                      console.log(query);
                      return;
                    }
                    const u_id = uuid();
                    localStorage.setItem(u_id, JSON.stringify(query));
                    window.location.href = `/sql-share/${u_id}`;
                  }}
                />
                <div className="download_options">
                  <img
                    data-tip="download"
                    src={Download_Icon}
                    alt=""
                    id="query_icon3"
                    onClick={() => {
                      if (downloadBar.status) {
                        return toggleDownloadBar({ index: -1, status: false });
                      }
                      toggleDownloadBar({ index: index, status: true });
                    }}
                  />
                  <ul
                    style={{
                      opacity:
                        downloadBar.status &&
                        downloadBar.index === index &&
                        JSON.stringify(query.download_data) !==
                          JSON.stringify({})
                          ? 1
                          : 0,
                      marginLeft:
                        downloadBar.status &&
                        downloadBar.index === index &&
                        JSON.stringify(query.download_data) !==
                          JSON.stringify({})
                          ? "1%"
                          : "-10%",
                      pointerEvents:
                        downloadBar.status &&
                        downloadBar.index === index &&
                        JSON.stringify(query.download_data) !==
                          JSON.stringify({})
                          ? "all"
                          : "none",
                    }}
                  >
                    <li>
                      <a
                        href={getDownloadLink(query.download_data, "text/csv")}
                        download={`${index + 1}.csv`}
                      >
                        As CSV
                      </a>
                    </li>
                    <li>
                      <a
                        href={getDownloadLink(query.download_data)}
                        download={`${index + 1}.json`}
                      >
                        As JSON
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="query_result_parent">
                <div
                  className="query_result"
                  style={{
                    height: query.resultTab
                      ? query.is_error.status
                        ? "80px"
                        : "400px"
                      : "1px",
                    visibility: query.resultTab === true ? "visible" : "hidden",
                  }}
                >
                  {query.is_error.status ? (
                    <h2
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "400",
                        marginLeft: "1%",
                        color: "red",
                        textShadow: "0.5px 0.5px 0.5px black",
                        cursor: "pointer",
                      }}
                    >
                      {query.is_error.message}
                    </h2>
                  ) : (
                    query.result
                  )}
                  {query.is_error.status ? null : (
                    <div className="query_res_stat">
                      <h3>Query ran successfully in 0.05s</h3>
                      <h3>rows affected 0</h3>
                    </div>
                  )}
                </div>
                <img
                  src={Cancel_Icon}
                  alt=""
                  style={{
                    visibility: query.resultTab === true ? "visible" : "hidden",
                    pointerEvents: query.resultTab === true ? "all" : "none",
                  }}
                  onClick={() => {
                    toggleResultTab(index);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="query_catalogue"
        style={{
          right: databaseInfoBox ? "-18%" : "-41%",
        }}
      >
        <img
          src={Table_Icon}
          alt=""
          onClick={() => {
            toggelDBInfoBox(!databaseInfoBox);
          }}
        />
        <div
          className="info_bx"
          style={{
            transition: "0.3s ease",
            opacity: !databaseInfoBox ? 0.1 : 1,
          }}
        >
          <h2>Database</h2>
          <h3>Session: {localStorage.getItem("session") || " none"}</h3>
          <input
            type="text"
            placeholder="search tables"
            value={searchBar}
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
          />
          <div className="table_info">
            {searchResults.map((item, index) => {
              if (item === "") {
                return null;
              }
              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid white",
                    paddingLeft: "5%",
                    paddingRight: "5%",
                  }}
                  onClick={() => {
                    updateCollapsed([!collapsed[0]]);
                  }}
                >
                  <h1>{item}</h1>
                  <img
                    src={Arrow_Down_Icon}
                    alt=""
                    id="arrow_down"
                    style={{
                      transform: !collapsed[0]
                        ? "rotate(90deg)"
                        : "rotate(-90deg)",
                    }}
                  />
                </div>
              );
            })}
            {Object.keys(masterData[0] || {}).map((item, index) => {
              return (
                <div
                  key={index}
                  className="table_data"
                  style={{
                    marginTop: !collapsed[0] ? "0%" : "-6%",
                    opacity: !collapsed[0] ? 1 : 0,
                  }}
                >
                  <h2>{item}</h2>
                  <h2>String</h2>
                </div>
              );
            })}
            <button
              className="delete_cell_btn"
              disabled={queries.length === 1}
              onClick={() => {
                let data = JSON.stringify(queries);
                data = JSON.parse(data);
                data.splice(data.length - 1, 1);
                updateQueryData(data);
                scroll.scrollToTop();
              }}
            >
              Delete Cell -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryEditor;
