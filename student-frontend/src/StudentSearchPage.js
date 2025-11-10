import React, { useState } from "react";

export default function StudentSearchPage() {
  const [search, setSearch] = useState({
    name: "",
    email: "",
    rollNo: "",
    phone: "",
  });

  const handleInput = (field, value) =>
    setSearch({ ...search, [field]: value });

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#fafbfc",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: 32,
          margin: "38px 0 34px 0",
          letterSpacing: 0.5,
          color: "#292268",
        }}
      >
        Student Search
      </h2>
      <div
        style={{
          maxWidth: 1150,
          margin: "0 auto",
          background: "#fff",
          border: "1.5px solid #e3e7f3",
          borderRadius: 32,
          boxShadow: "0 2px 10px #f2f4fb",
          padding: "38px 28px",
        }}
      >
        {/* Table layout */}
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "transparent",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  color: "#313131",
                  fontWeight: 600,
                  fontSize: 18,
                  textAlign: "left",
                  paddingBottom: 7,
                  paddingLeft: 20,
                  border: "none",
                }}
              >
                Name
              </th>
              <th
                style={{
                  color: "#313131",
                  fontWeight: 600,
                  fontSize: 18,
                  textAlign: "left",
                  paddingBottom: 7,
                  paddingLeft: 20,
                  border: "none",
                }}
              >
                Email
              </th>
              <th
                style={{
                  color: "#313131",
                  fontWeight: 600,
                  fontSize: 18,
                  textAlign: "left",
                  paddingBottom: 7,
                  paddingLeft: 20,
                  border: "none",
                }}
              >
                Roll No
              </th>
              <th
                style={{
                  color: "#313131",
                  fontWeight: 600,
                  fontSize: 18,
                  textAlign: "left",
                  paddingBottom: 7,
                  paddingLeft: 20,
                  border: "none",
                }}
              >
                Phone
              </th>
              <th style={{ width: 160, border: "none" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: 0,
                  borderTop: "none",
                  borderLeft: "none",
                  borderBottomLeftRadius: 16,
                  background: "#f5f7fa",
                  borderRight: "1.2px solid #ebedf1",
                }}
              >
                <input
                  value={search.name}
                  onChange={(e) => handleInput("name", e.target.value)}
                  placeholder="Student Name"
                  style={{
                    width: "100%",
                    padding: "18px 16px 18px 20px",
                    fontSize: 16.5,
                    border: "none",
                    background: "transparent",
                    fontWeight: 500,
                    outline: "none",
                  }}
                />
              </td>
              <td
                style={{
                  padding: 0,
                  borderTop: "none",
                  background: "#f5f7fa",
                  borderRight: "1.2px solid #ebedf1",
                }}
              >
                <input
                  value={search.email}
                  onChange={(e) => handleInput("email", e.target.value)}
                  placeholder="Email"
                  type="email"
                  style={{
                    width: "100%",
                    padding: "18px 16px 18px 20px",
                    fontSize: 16.5,
                    border: "none",
                    background: "transparent",
                    fontWeight: 500,
                    outline: "none",
                  }}
                />
              </td>
              <td
                style={{
                  padding: 0,
                  borderTop: "none",
                  background: "#f5f7fa",
                  borderRight: "1.2px solid #ebedf1",
                }}
              >
                <input
                  value={search.rollNo}
                  onChange={(e) => handleInput("rollNo", e.target.value)}
                  placeholder="Roll No"
                  style={{
                    width: "100%",
                    padding: "18px 16px 18px 20px",
                    fontSize: 16.5,
                    border: "none",
                    background: "transparent",
                    fontWeight: 500,
                    outline: "none",
                  }}
                />
              </td>
              <td
                style={{
                  padding: 0,
                  borderTop: "none",
                  background: "#f5f7fa",
                  borderRight: "none",
                  borderBottomRightRadius: 0,
                }}
              >
                <input
                  value={search.phone}
                  onChange={(e) => handleInput("phone", e.target.value)}
                  placeholder="Phone"
                  style={{
                    width: "100%",
                    padding: "18px 16px 18px 20px",
                    fontSize: 16.5,
                    border: "none",
                    background: "transparent",
                    fontWeight: 500,
                    outline: "none",
                  }}
                />
              </td>
              {/* Search Button */}
              <td
                style={{
                  paddingLeft: 16,
                  paddingRight: 10,
                  border: "none",
                  background: "transparent",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    background: "#16db38",
                    color: "#fff",
                    padding: "17px 0",
                    fontSize: 21,
                    border: "none",
                    borderRadius: 17,
                    fontWeight: 700,
                    boxShadow: "0 1px 8px #bff0c5",
                    cursor: "pointer",
                    transition: "background 0.13s",
                  }}
                  onClick={() => alert(JSON.stringify(search))}
                >
                  Get Data
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}