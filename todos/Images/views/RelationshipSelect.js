/** @jsx jsx */
import { jsx } from "@emotion/core";
import { gql, useQuery } from "@apollo/client";
import Select from "@arch-ui/select";
import { components } from "react-select";
import "intersection-observer";
import { useState, useMemo, useRef, useEffect, forwardRef } from "react";

function useIntersectionObserver(cb, ref) {
  useEffect(() => {
    let observer = new IntersectionObserver(cb, {});
    let node = ref.current;
    if (node !== null) {
      observer.observe(node);
      return () => observer.unobserve(node);
    }
  });
}

const initialItemsToLoad = 10;
const subsequentItemsToLoad = 50;
const Label = (config) =>
  function ({ value, label }) {
    return value[config.file] ? (
      <img
        src={value[config.file].publicUrl}
        style={{ maxHeight: 100, maxWidth: 200 }}
      />
    ) : (
      <small>{value[config.search] ? value[config.search] : label}</small>
    );
  };
const getOption = (options = [], value) => {
  const exist = options.find((opt) => opt.value.id === value.id);
  return (
    exist || {
      label: value._label_,
      value: value,
    }
  );
};

// to use hooks in render props
const Relationship = forwardRef(
  (
    {
      data,
      loading,
      value,
      currentValue,
      refList,
      canRead,
      isMulti,
      search,
      autoFocus,
      serverErrors,
      onChange,
      htmlID,
      setSearch,
      selectProps,
      fetchMore,
      isDisabled,
      options,
      config,
    },
    ref,
  ) => {
    // const options =
    //   data && data[refList.gqlNames.listQueryName]
    //     ? data[refList.gqlNames.listQueryName].map((val) => ({
    //         value: val,
    //         label: val._label_,
    //       }))
    //     : [];
    const serverError =
      serverErrors &&
      serverErrors.find(
        (error) => error instanceof Error && error.name === "AccessDeniedError",
      );
    if (value !== null && canRead) {
      if (isMulti) {
        currentValue = (Array.isArray(value) ? value : []).map((value) =>
          getOption(options, value),
        );
      } else if (value) {
        currentValue = getOption(options, value);
      }
    }
    const count =
      data && data[refList.gqlNames.listQueryMetaName]
        ? data[refList.gqlNames.listQueryMetaName].count
        : 0;

    const selectComponents = useMemo(
      () => ({
        MenuList: ({ children, ...props }) => {
          const loadingRef = useRef(null);
          const QUERY = gql`
            query RelationshipSelectMore($search: String!, $first: Int!, $skip: Int!) {
              ${refList.gqlNames.listQueryName}(where: { ${config.search}_contains_i: $search }, first: $first, skip: $skip) {
                _label_
                id
                ${config.file} {
                  publicUrl
                }
              }
            }
          `;

          useIntersectionObserver(([{ isIntersecting }]) => {
            if (
              !props.isLoading &&
              isIntersecting &&
              props.options.length < count
            ) {
              fetchMore({
                query: QUERY,
                variables: {
                  search,
                  first: subsequentItemsToLoad,
                  skip: props.options.length,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...prev,
                    [refList.gqlNames.listQueryName]: [
                      ...prev[refList.gqlNames.listQueryName],
                      ...fetchMoreResult[refList.gqlNames.listQueryName],
                    ],
                  };
                },
              });
            }
          }, loadingRef);

          return (
            <components.MenuList {...props}>
              {children}
              <div css={{ textAlign: "center" }} ref={loadingRef}>
                {props.options.length < count && (
                  <span css={{ padding: 8 }}>Loading...</span>
                )}
              </div>
            </components.MenuList>
          );
        },
      }),
      [count, refList.gqlNames.listQueryName],
    );
    return (
      <Select
        // this is necessary because react-select passes a second argument to onInputChange
        // and useState setters log a warning if a second argument is passed
        onInputChange={(val) => setSearch(val)}
        isLoading={loading}
        autoFocus={autoFocus}
        isMulti={isMulti}
        components={selectComponents}
        formatOptionLabel={Label(config)}
        getOptionValue={(option) => option.value.id}
        value={currentValue}
        placeholder={canRead ? undefined : serverError && serverError.message}
        options={options}
        onChange={onChange}
        id={`react-select-${htmlID}`}
        isClearable
        instanceId={htmlID}
        inputId={htmlID}
        innerRef={ref}
        menuPortalTarget={document.body}
        isDisabled={isDisabled}
        styles={{ padding: 0 }}
        {...selectProps}
      />
    );
  },
);

const RelationshipSelect = ({
  innerRef,
  autoFocus,
  field,
  errors: serverErrors,
  renderContext,
  htmlID,
  onChange,
  isMulti,
  value,
  isDisabled,
}) => {
  const [search, setSearch] = useState("");
  const refList = field.getRefList();
  const { config } = field;
  const QUERY = gql`
    query RelationshipSelect($search: String!, $ids:[ID] $first: Int!, $skip: Int!) {
      ${refList.gqlNames.listQueryName}(
        where: { 
          id_in: $ids 
        }, first: $first, skip: $skip) {
        _label_
        id
        ${config.file} {
          publicUrl
        }
      }
      search:${refList.gqlNames.listQueryName}(
        where: { 
          ${config.search}_contains_i: $search
        }, first: $first, skip: $skip) {
        _label_
        id
        ${config.file} {
          publicUrl
        }
      }

      ${refList.gqlNames.listQueryMetaName}(where: { 
        id_in: $ids 
      }) {
        count
      }
    }
  `;

  const canRead =
    !serverErrors ||
    serverErrors.every(
      (error) =>
        !(error instanceof Error && error.name === "AccessDeniedError"),
    );
  const selectProps =
    renderContext === "dialog" ? { menuShouldBlockScroll: true } : null;
  const ids = (Array.isArray(value) ? value : [value]).map((value) => value.id);
  const { data, error, loading, fetchMore } = useQuery(QUERY, {
    fetchPolicy: "network-only",
    variables: {
      search,
      first: initialItemsToLoad,
      skip: 0,
      ids,
    },
  });

  // TODO: better error UI
  // TODO: Handle permission errors
  // (ie; user has permission to read this relationship field, but
  // not the related list, or some items on the list)
  if (error) {
    console.log("ERROR!!!", error);
    return "Error";
  }
  var options =
    data && data[refList.gqlNames.listQueryName]
      ? data[refList.gqlNames.listQueryName].map((val) => ({
          value: val,
          label: val._label_,
        }))
      : [];
  if (data && data.search) {
    options = options.concat(
      data.search.map((val) => ({
        value: val,
        label: val._label_,
      })),
    );
  }
  var currentValue = null;
  if (value !== null && canRead) {
    if (isMulti) {
      currentValue = (Array.isArray(value) ? value : []).map((value) =>
        getOption(options, value),
      );
    } else if (value) {
      currentValue = getOption(options, value);
    }
  }
  return (
    <Relationship
      {...{
        data,
        loading,
        value,
        currentValue,
        refList,
        canRead,
        isMulti,
        search,
        autoFocus,
        serverErrors,
        onChange,
        htmlID,
        setSearch,
        selectProps,
        fetchMore,
        ref: innerRef,
        isDisabled,
        options,
        config,
      }}
    />
  );
};

export default RelationshipSelect;
