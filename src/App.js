import React, { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
  gql,
  useQuery,
} from "@apollo/client";
import "./App.css";

const httpLink = new HttpLink({
  uri: "https://r54obovrl5axjn37ywqdia424a.appsync-api.us-east-2.amazonaws.com/graphql",
  headers: {
    "x-api-key": "da2-buxvnlc6y5hktmx6mqravmoox4",
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function Books() {
  const [selectedFields, setSelectedFields] = useState({
    ISBN: false,
    Title: true,
    Author: false,
    Genre: false,
    Category: false,
    Edition: false,
    Status: false,
  });

  const handleFieldChange = (field) => {
    setSelectedFields({ ...selectedFields, [field]: !selectedFields[field] });
  };

  const constructQuery = () => {
    const fields = Object.keys(selectedFields).filter(
      (key) => selectedFields[key]
    );
    if (fields.length === 0) {
      return gql`
        query {
          __typename
        }
      `;
    } else {
      return gql`
        query GetBooks {
          books {
            ${fields.join("\n")}
          }
        }
      `;
    }
  };

  const GET_BOOKS_DYNAMIC = constructQuery();
  const { loading, error, data, refetch } = useQuery(GET_BOOKS_DYNAMIC, {
    skip: Object.values(selectedFields).every((value) => !value),
  });

  useEffect(() => {
    refetch();
  }, [selectedFields, refetch]);

  if (loading) return <div className="loading-animation"></div>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="p-4">
      <div className="checkbox-container">
        {Object.keys(selectedFields).map((field) => (
          <Checkbox
            key={field}
            label={field}
            checked={selectedFields[field]}
            onChange={() => handleFieldChange(field)}
          />
        ))}
      </div>
      <div className="books-grid">
        {" "}
        {data?.books?.map((book, index) => (
          <div key={index} className="book-card">
            {selectedFields.Title && book.Title && (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                Title: {book.Title}
              </p>
            )}
            {selectedFields.Author && book.Author && (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                Author: {book.Author}
              </p>
            )}
            {selectedFields.Genre && book.Genre && (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                Genre: {book.Genre}
              </p>
            )}
            {selectedFields.Category && book.Category && (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                Category: {book.Category}
              </p>
            )}
            {selectedFields.Edition && book.Edition && (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                Edition: {book.Edition}
              </p>
            )}
            {selectedFields.ISBN && book.ISBN && (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                ISBN: {book.ISBN}
              </p>
            )}
            {selectedFields.Status && book.Status && (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                Status: {book.Status}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
        id={`checkbox-${label}`}
      />
      <label
        htmlFor={`checkbox-${label}`}
        className={`w-5 h-5 flex items-center justify-center mr-2 rounded border ${
          checked ? "bg-blue-600 border-blue-600" : "border-gray-300"
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </label>
      <span className="text-sm ">{label}</span>
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <Books />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
