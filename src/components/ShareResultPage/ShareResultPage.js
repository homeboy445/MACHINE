import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Download_Icon from "../../assets/icons/download.svg";

const ShareResultPage = () => {
  const [query, updateQuery] = useState({
    name: "",
    result: null,
    resultTab: false,
    is_error: {
      status: false,
      message: "Something's wrong. Try again later.",
    },
    download_data: [],
    session: "",
  });
  const [downloadBar, toggleDownloadBar] = useState(false);
  const [isLoaded, updateLoadStatus] = useState(false);

  const getDownloadLink = (data, contentType = "application/json") => {
    let main_Data = null;
    if (data.length === 0) {
      return null;
    }
    if (JSON.stringify(data) === JSON.stringify({})) {
      return null;
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
    if (!isLoaded) {
      const url = window.location.pathname;
      const uuid = url.substr(url.lastIndexOf("/") + 1);
      updateQuery(JSON.parse(localStorage.getItem(uuid)));
      updateLoadStatus(true);
    }
  }, [query, downloadBar]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
        <h2 id="sess_hdr">{query.session || "Session1"}</h2>
      </div>
      <div
        className="query_list list2"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <div className="query_box">
          <div className="query_edit">
            <p>[1]: </p>
            <input
              type="text"
              spellCheck="false"
              className="query_input"
              value={query.name}
              disabled={true}
            />
            <div className="download_options">
              <img
                data-tip="download"
                src={Download_Icon}
                alt=""
                id="query_icon3"
                onClick={() => {
                  toggleDownloadBar(!downloadBar);
                }}
              />
              <ul
                style={{
                  opacity:
                    downloadBar &&
                    JSON.stringify(query.download_data) !== JSON.stringify({})
                      ? 1
                      : 0,
                  marginLeft:
                    downloadBar &&
                    JSON.stringify(query.download_data) !== JSON.stringify({})
                      ? "1%"
                      : "-10%",
                  pointerEvents:
                    downloadBar &&
                    JSON.stringify(query.download_data) !== JSON.stringify({})
                      ? "all"
                      : "none",
                }}
              >
                <li>
                  <a
                    href={getDownloadLink(query.download_data, "text/csv")}
                    download={`${0 + 1}.csv`}
                    style={{
                      color: "grey",
                      textDecoration: "none",
                    }}
                    onClick={()=>{
                      if (downloadBar) {
                        toggleDownloadBar(false);
                      }
                    }}
                  >
                    As CSV
                  </a>
                </li>
                <li>
                  <a
                    href={getDownloadLink(query.download_data)}
                    download={`${0 + 1}.json`}
                    style={{
                      color: "grey",
                      textDecoration: "none",
                    }}
                    onClick={()=>{
                      if (downloadBar) {
                        toggleDownloadBar(false);
                      }
                    }}
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
              {
                <table id="res_table">
                  <tbody>
                    <tr>
                      {query.download_data.length > 0
                        ? Object.keys(query.download_data[0]).map(
                            (item, index) => {
                              return <th key={uuid()}>{item}</th>;
                            }
                          )
                        : null}
                    </tr>
                  </tbody>
                  {query.download_data.length > 0
                    ? (query.download_data || []).map((dataObj, index) => {
                        return (
                          <tbody key={uuid()}>
                            <tr>
                              {Object.keys(dataObj).map((key, index) => {
                                return <td key={uuid()}>{dataObj[key]}</td>;
                              })}
                            </tr>
                          </tbody>
                        );
                      })
                    : null}
                </table>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareResultPage;
