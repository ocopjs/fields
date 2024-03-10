/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Fragment, useMemo, useState } from "react";
import { FieldContainer, FieldLabel, FieldDescription } from "@arch-ui/fields";
import { ArrowRightIcon } from "@primer/octicons-react";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import options from "../options";
import Value from "../../../Value";

const SelectField = ({
  field,
  list,
  item = {},
  errors,
  value = [],
  onChange = () => {},
}) => {
  console.log(value);
  const handleChange = (option) => {
    const { many } = field.config;
    if (many) {
      onChange(option ? option.map((i) => i.value) : []);
    } else {
      onChange(option ? option.value : null);
    }
  };

  const [to, setTo] = useState();

  const {
    config: { lang: _langField },
  } = field;

  const _currentLang = item[_langField];
  const trans = [];
  if (list && list.fields)
    list.fields.map((field) => {
      if (field.type === "Text" || field.type === "Text$1") {
        trans.push(field);
      }
    });

  const popup = useMemo(
    () =>
      Boolean(to && item) && (
        <Popup
          options={options}
          onClose={(translations = []) => {
            const ids = translations.map((t) => ({
              id: t.id,
            }));
            onChange(ids);
            setTo(false);
          }}
          list={list}
          trans={trans}
          item={item}
          field={field}
          to={to}
          from={_currentLang}
        />
      ),
    [_currentLang, to, item],
  );
  if (!_currentLang) return "Vui lòng chọn ngôn ngữ sử dụng trước";
  const htmlID = `ks-input-${field.path}`;
  return (
    <Fragment>
      <FieldContainer>
        <FieldLabel htmlFor={htmlID} field={field} errors={errors} />
        <FieldDescription text={field.adminDoc} />
        {options.map((option) => {
          function clickLang(event) {
            console.log(event.target.value);
            if (option.value !== to) setTo(option.value);
          }
          return (
            option.value !== _currentLang && (
              <button
                key={option.value}
                className="btn mb-2 mr-2"
                type="button"
                onClick={clickLang}
              >
                {option.label}
              </button>
            )
          );
        })}
      </FieldContainer>
      {popup}
    </Fragment>
  );
};

export default SelectField;

function Popup({ field, options, onClose, list, trans, item, from, to }) {
  console.log("Popup", to);
  let relatedList = field.getRefList();
  const {
    config: { listKey },
  } = field;
  const [changes, setChanges] = useState({});
  const [isSave, setIsSave] = useState(true);
  const client = useApolloClient();
  const { loading, data, error, refetch, variables } = useQuery(
    gql`
      query ($where: ${relatedList.gqlNames.whereInputName}) {
        ${relatedList.gqlNames.listQueryName}(where: $where) {
          id
          item
          listKey
          fieldName
          lang
          content
        }
      }
    `,
    {
      variables: { where: { item: item.id, listKey } },
    },
  );
  if (loading) {
    console.log(variables);
    return "Đang tải...";
  }
  if (error) {
    return <p>Lỗi, {error.toString()}</p>;
  }
  const translations = data ? data[relatedList.gqlNames.listQueryName] : [];
  const _root = item;
  const _from = options.find((i) => i.value === from);
  const _to = options.find((i) => i.value === to);

  function changeTrans(data) {
    setIsSave(false);
    setChanges((changes) => {
      return { ...changes, [data.data.fieldName]: data };
    });
  }

  /**
   *
   * @param {Event} e
   */
  function clickSave(e) {
    e.preventDefault();
    var variables = { updates: [], creates: [] };
    for (var field in changes) {
      const change = changes[field];
      if (change.id) {
        variables.updates.push(change);
      } else {
        variables.creates.push(change);
      }
    }
    if (!loading) {
      client
        .mutate({
          mutation: gql`
            mutation (
              $updates: [TranslatesUpdateInput]
              $creates: [TranslatesCreateInput]
            ) {
              updateTranslates(data: $updates) {
                id
              }
              createTranslates(data: $creates) {
                id
              }
            }
          `,
          variables,
        })
        .then(() => {
          refetch().then(() => {
            setIsSave(true);
          });
        })
        .catch((error) => console.log(error));
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        zIndex: 2,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.15)",
          padding: 100,
        }}
      >
        <div
          className="container-lg"
          style={{
            height: "100%",
            backgroundColor: "white",
            zIndex: 3,
            borderRadius: 6,
            boxShadow: `0px 2px 5px 0px rgb(9 30 66 / 12%)`,
            transition: `box-shadow 111ms ease-out,transform 111ms ease-out`,
            padding: 13,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, overflowY: "scroll" }}>
            <h5>
              <span className="color-text-secondary">{_from.label}</span>
              <span className="mx-3">
                <ArrowRightIcon />
              </span>
              {_to.label}
            </h5>
            <div className="container-lg clearfix">
              {trans.map((field, index) => {
                const translation = translations.find(
                  (t) => t.fieldName === field.path && t.lang === to,
                );
                return (
                  <Input
                    field={field}
                    key={index}
                    list={list}
                    item={_root}
                    onChange={changeTrans}
                    changes={changes}
                    translation={translation}
                    lang={to}
                  />
                );
              })}
            </div>
          </div>
          <div
            className="pt-3"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button
              className="btn btn-primary mr-3"
              onClick={clickSave}
              disabled={isSave}
            >
              {loading ? "Đang tải..." : "Lưu bản dịch"}
            </button>

            <button
              className="btn ml-auto"
              onClick={(event) => {
                event.preventDefault();
                if (isSave) onClose(translations);
                else if (
                  confirm("Bạn chưa lưu thay đổi, bạn chắc chắn muốn thoát?")
                ) {
                  onClose(translations);
                }
              }}
            >
              Đóng {!isSave && "(không lưu)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  changes,
  field,
  list,
  item = {},
  translation = {},
  onChange: _onChange = () => {},
  lang,
}) {
  const [Field] = useMemo(() => {
    return field.readViews([field.views.Field]);
  }, [field]);
  function onChange(event) {
    _onChange({
      id: translation?.id,
      data: {
        item: item.id,
        listKey: list.gqlNames.outputTypeName,
        fieldName: field.path,
        content: event,
        lang,
      },
    });
  }
  const value =
    changes[field.path]?.data?.content ||
    (translation ? translation?.content : "");
  return (
    (field.type === "Text" || field.type === "Text$1") && (
      <div className="row">
        <hr />
        <FieldLabel field={field} errors={[]} />
        <FieldDescription text={field.adminDoc} />
        <Value className="pr-2 color-text-secondary">
          {item[field.path] || "-"}
        </Value>
        <Field
          field={field}
          isDisabled={false}
          errors={[]}
          value={value}
          onChange={(_value) => (_value !== value ? onChange(_value) : null)}
          preview
        />
      </div>
    )
  );
}
