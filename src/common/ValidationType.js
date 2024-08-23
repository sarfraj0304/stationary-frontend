import moment from "moment/moment";
import * as Yup from "yup";

export const numberValidation = /^[0-9]*$/;
export const numberValidation2 = /^[1-9]\d{0,3}$/;
export const stringValidation = /^[a-zA-Z\s-.n,]*$/;
export const symbolValidation = /^[A-Za-z0-9\s-,/().""']+$/;
export const allSymbolValidation = /^[A-Za-z0-9\s-,/().$_""']+$/;
export const SearchValidation = /^[A-Za-z0-9\s-,/().""'!@#$%*()"{}|?><_]+$/;
const websiteValidation =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
const emailValidation =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneNumberValidation = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g;
const telPoneNumber =
  /^\+?\(?([0-9]{0,5})\)?[-. ]?([0-9]{0,5})[-. ]?([0-9]{0,9})$/;
const passwordValidation =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const userName1 = /^[A-Za-z]/,
  userName2 = /^[A-Za-z]\w{0,29}$/;
const mobileNumberValidation = /^[6-9]\d{9}$/;

const domainValidation =
  /^[a-zA-Z0-9.][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

const MpinValidation = /^[0-9]{4}$/;

function ValidationType(control, validation, trans) {
  if (control === "normal") {
    if (validation.type === "true") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      } else {
        return Yup.string()
          .nullable()
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      }
    } else if (validation.type === "string") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .matches(
            validation?.allowRegex || stringValidation,
            validation?.msg || "Only alphabets are allowed."
          )
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      } else {
        return Yup.string()
          .nullable()
          .trim("Can not contain only space.")
          .matches(
            validation?.allowRegex || stringValidation,
            validation?.msg || "Only alphabets are allowed."
          )
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      }
    } else if (validation.type === "alphabet") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(stringValidation, "Only alphabets are allowed.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      return Yup.string()
        .matches(stringValidation, "Only alphabets are allowed.")
        .max(
          validation.max ?? 60,
          `You can't use more than ${validation.max ?? 60} characters.`
        );
    } else if (validation.type === "custom") {
      if (validation.required && validation?.custom) {
        return Yup.string()
          .required("Field can't be empty")
          .matches(validation?.validateFunc(), validation?.msg)
          .max(
            validation.max ?? 100,
            `You can't use more than ${validation.max ?? 100} characters.`
          );
      }
      if (validation.required)
        return Yup.mixed()
          .required("Field can't be empty")
          .test("dynamicValidation", validation["msg"], (value) => {
            const exp = validation.regex.replace(/^\/|\/$/g, "");
            const regexObject = new RegExp(`${exp}`);
            return regexObject.test(value);
          });

      return Yup.mixed().test("dynamicValidation", validation.msg, (value) => {
        const exp = validation.regex.replace(/^\/|\/$/g, "");
        const regexObject = new RegExp(`${exp}`);
        return regexObject.test(value);
      });
    } else if (validation.type === "decimal") {
      if (validation.required)
        return Yup.string().matches(
          /^\d+(\.\d+)?$/,
          "Must be a valid decimal number"
        );
      return Yup.string().matches(
        /^\d+(\.\d+)?$/,
        "Must be a valid decimal number"
      );
    } else if (validation.type === "onlyDigits") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(numberValidation, "Only digits are allowed.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} numbers.`
          );
      return Yup.string()
        .matches(numberValidation, "Only digits are allowed.")
        .max(
          validation.max ?? 60,
          `You can't use more than ${validation.max ?? 60} numbers.`
        );
    } else if (validation.type === "onlyDigits2") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .matches(
            validation?.validateFunc(),
            "Only digits are allowed and digits must be greater than 0."
          );
      }
      return Yup.string()
        .nullable()
        .matches(
          validation?.validateFunc(),
          "Only digits are allowed and digits must be greater than 0."
        );
    } else if (validation.type === "userName") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} character.`
          )
          .matches(
            userName1,
            "Only alphabetic value are allowed at first place"
          )
          .min(
            validation.min,
            `You can't use less than ${validation.min} character.`
          )
          .matches(
            userName2,
            "Only alphanumeric values and underscores are allowed."
          );
      return Yup.string()
        .max(
          validation.max ?? 60,
          `You can't use more than ${validation.max ?? 60} character.`
        )
        .matches(userName1, "Only alphabetic value are allowed at first place")
        .min(
          validation.min,
          `You can't use less than ${validation.min} character.`
        )
        .matches(
          userName2,
          "Only alphanumeric values and underscores are allowed."
        );
    } else if (validation.type === "numeric") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(
            validation?.allowRegex ?? numberValidation,
            validation?.msg || "Only numbers are allowed."
          )
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} digits.`
          );

      return Yup.string()
        .nullable()
        .matches(
          validation?.allowRegex ?? numberValidation,
          "Only numbers allowed."
        )
        .max(
          validation.max ?? 60,
          `You can't use more than ${validation.max ?? 60} digits.`
        );
    } else if (validation.type === "phone") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .min(validation.min || 10, "Please enter 10 digit mobile number")
          .max(validation.max || 10, "Please enter 10 digit mobile number")
          .matches(phoneNumberValidation, "Only number  are allowed");
      return Yup.string()
        .nullable()
        .min(validation.min || 10, "Please enter 10 digit mobile number")
        .max(validation.max || 10, "Please enter 10 digit mobile number")
        .matches(phoneNumberValidation, "Only number  are allowed");
    } else if (validation.type === "aadhar") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .min(12, "Please enter 12 digit aadhaar no.")
          .max(12, "Please enter 12 digit aadhaar no.")
          .matches(numberValidation, "Only number  are allowed");
      return Yup.string()
        .nullable()
        .min(12, "Please enter 12 digit aadhaar no.")
        .max(12, "Please enter 12 digit aadhaar no.")
        .matches(numberValidation, "Only number  are allowed");
    } else if (validation.type === "pincode") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .min(6, "Please enter 6 digit Pincode")
          .max(6, "Please enter 6 digit Pincode")
          .matches(numberValidation, "Only number  are allowed");
      return Yup.string()
        .nullable()
        .min(6, "Please enter 6 digit Pincode")
        .max(6, "Please enter 6 digit Pincode")
        .matches(numberValidation, "Only number  are allowed");
    } else if (validation.type === "withoutSymbol") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(
            validation?.allowRegex ?? symbolValidation,
            validation?.msg ?? "Only alphanumeric values are allowed."
          )
          .trim("This field cannot contain only blank spaces.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      return Yup.string()
        .nullable()
        .matches(
          validation?.allowRegex ?? symbolValidation,
          validation?.msg ?? "Only alphanumeric values are allowed."
        )
        .trim("This field can not contain only blank spaces.")
        .max(
          validation.max ?? 60,
          `You can't use more than ${validation.max ?? 60} characters.`
        );
    } else if (validation.type === "email") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(emailValidation, "Enter the Valid email.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      return Yup.string()
        .nullable()
        .matches(emailValidation, "Enter the Valid email.")
        .max(
          validation.max ?? 60,
          `You can't use more than ${validation.max ?? 60} characters.`
        );
    } else if (validation.type === "mobile") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(
            validation.allowRegex || mobileNumberValidation,
            "Enter the valid mobile number."
          )
          .max(
            validation.max || 10,
            `You can't use more than ${validation.max || 10} digits.`
          )
          .min(
            validation.min || 10,
            `Please enter minimum ${validation.min || 10} digit mobile number.`
          );
      return Yup.string()
        .nullable()
        .matches(mobileNumberValidation, "Enter the valid mobile number.")
        .max(
          validation.max || 10,
          `You can't use more than ${validation.max} digits.`
        )
        .min(
          validation.min || 10,
          `Please enter minimum ${validation.min} digit mobile number.`
        );
    } else if (validation.type === "endSection") {
      if (validation.required)
        return Yup.string()
          .test("compare value", function (value) {
            let value1 = this.resolve(Yup.ref("fromSection"));
            let value2 = this.resolve(Yup.ref("endSection"));
            if (value1 > value2) {
              return this.createError({
                message: `Please enter the section after '${value1}'.`,
                path: "endSection",
              });
            } else return true;
          })
          .required("Field can't be empty");
      return Yup.string().test("compare value", function (value) {
        let value1 = this.resolve(Yup.ref("fromSection"));
        let value2 = this.resolve(Yup.ref("endSection"));
        if (value1 > value2) {
          return this.createError({
            message: `Please enter the section after '${value1}'.`,
            path: "endSection",
          });
        } else return true;
      });
    } else if (validation.type === "website") {
      if (validation.required)
        return Yup.string()
          .matches(websiteValidation, "Enter the correct url.")
          .required("Field can't be empty")
          .max(
            validation.max,
            `You can't use more than ${validation.max} characters.`
          );
      return Yup.string()
        .nullable()
        .matches(websiteValidation, "Enter the correct url.")
        .max(
          validation.max,
          `You can't use more than ${validation.max} characters.`
        );
    } else if (validation.type === "domain") {
      if (validation.required)
        return Yup.string()
          .matches(domainValidation, "Enter the correct url.")
          .required("Field can't be empty")
          .max(
            validation.max,
            `You can't use more than ${validation.max} characters.`
          );
      return (
        Yup.string()
          .matches(
            validation.allowRegex ?? domainValidation,
            "Enter the correct url."
          )
          // .matches(domainWithWww, "Enter the correct url.")
          .max(
            validation.max,
            `You can't use more than ${validation.max} characters.`
          )
          .nullable()
      );
    } else if (validation.type === "telNo") {
      if (validation.required)
        return Yup.string()
          .matches(telPoneNumber, "Enter the valid phone number.")
          .required("Field can't be empty")
          .min(
            validation.min,
            `You can't use less than ${validation.min} digits.`
          )
          .max(
            validation.max,
            `You can't use more than ${validation.max} digits.`
          );
      return Yup.string()
        .nullable()
        .matches(telPoneNumber, "Enter the valid phone number.")
        .min(
          validation.min,
          `You can't use less than ${validation.min} digits.`
        )
        .max(
          validation.max,
          `You can't use more than ${validation.max} digits.`
        );
    } else if (validation.type === "compTelNo") {
      //comparing 2 phone number

      return Yup.string()
        .test("compare value", function () {
          let value1 = this.resolve(Yup.ref("phoneNo1"));
          let value2 = this.resolve(Yup.ref("phoneNo2"));
          if (value1 == value2 && value2) {
            return this.createError({
              message: `Phone No. must be unique`,
              path: "phoneNo2",
            });
          } else {
            return true;
          }
        })
        .matches(telPoneNumber, "Enter the valid phone number.")
        .min(
          validation.min,
          `You can't use less than ${validation.min} digits.`
        )
        .max(
          validation.max,
          `You can't use more than ${validation.max} digits.`
        );
    } else if (validation.type === "fax") {
      if (validation.required)
        return Yup.string()
          .matches(phoneNumberValidation, "Enter the valid fax number.")
          .required("Field can't be empty")
          .max(
            validation.max,
            `You can't use more than ${validation.max} digits.`
          );
      return Yup.string()
        .matches(phoneNumberValidation, "Enter the valid fax number.")
        .max(
          validation.max,
          `You can't use more than ${validation.max} digits.`
        );
    } else if (validation.type === "number") {
      if (validation.required)
        return Yup.number()
          .positive("Number must be positive")
          .required("Field can't be empty");
      return Yup.number().positive("Number must be positive");
    } else if (validation.type === "normal") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(/\S+/, "Field can't be empty.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      else {
        return Yup.string()
          .nullable()
          .matches(
            /^[a-zA-Z0-9]/,
            "First Character should be Alphabet or Number."
          )
          .max(
            validation.max,
            `You can't use more than ${validation.max} characters.`
          );
      }
    } else if (validation.type === "none") {
      if (validation.required)
        return Yup.string()
          .nullable()
          .trim("This field can not contain only blank spaces")
          .required("Field can't be empty");
      else {
        return Yup.string();
      }
    } else if (validation.type === "ALLSYMBOL") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(
            allSymbolValidation,
            "This special character is not allowed."
          )
          .trim("Can not contain only space.")
          .max(
            validation.max,
            `You can't use more than ${validation.max} characters.`
          );
    } else {
      Yup.string()
        .matches(allSymbolValidation, "This special character is not allowed.")
        .trim("Can not contain only space.")
        .max(
          validation.max,
          `You can't use more than ${validation.max} characters.`
        );
    }
  } else if (control === "date") {
    if (validation.type === "minDate") {
      if (validation.required)
        return Yup.date()
          .transform(function (value, originalValue) {
            if (this.isType(value)) {
              return value;
            }
            const result =
              moment(originalValue).format("DD-MM-YYYY") || moment();

            return result;
          })
          .typeError("Please enter a valid date.")
          .required("Field can't be empty")
          .min(
            Yup.ref("fromDate"),
            "Make sure your ending date should be greater as per starting date."
          );
      return Yup.date()
        .transform(function (value, originalValue) {
          if (this.isType(value)) {
            return value;
          }
          const result = moment(originalValue).format("DD-MM-YYYY") || moment();
          return result;
        })
        .typeError("Please enter a valid date.")
        .min(
          validation.minDate,
          "Make sure your ending date should be greater as per starting date."
        );
    } else if (validation?.type == "endDateCheck") {
      return Yup.date()
        .nullable()
        .transform((curr, orig) => (orig === null ? null : curr))
        .required("Please enter a valid date.")
        .min(
          Yup.ref("validFrom"),
          "End date can't be before or equal to Start date"
        );
    } else if (validation.type === "true") {
      if (validation.required)
        return Yup.date()
          .transform(function (value, originalValue) {
            if (this.isType(value)) {
              return value;
            }
            const result =
              moment(originalValue).format("DD-MM-YYYY") || moment();
            return result;
          })
          .typeError(validation.msg || "Please enter a valid date.")
          .required("Field can't be empty");

      return Yup.date()
        .transform(function (value, originalValue) {
          if (this.isType(value)) {
            return value;
          }
          const result = moment(originalValue).format("DD-MM-YYYY") || moment();
          return result;
        })
        .typeError("Please enter a valid date.");
    }
    //  else if (validation.min && validation.max) {
    //   {
    //     if (validation.required)
    //       return Yup.date()
    //         .transform(function (value, originalValue) {
    //           if (this.isType(value)) {
    //             return value;
    //           }
    //           const result =
    //             moment(originalValue).format("DD-MM-YYYY") || moment();

    //           return result;
    //         })
    //         .typeError("Please enter a valid date.")
    //         .required("Field can't be empty")
    //         .min(
    //           moment(`01-01-${moment().year()}`, "DD-MM-YYYY"),
    //           "Start date should be current calender year."
    //         )
    //         .max(
    //           moment(`31-12-${moment().year()}`, "DD-MM-YYYY"),
    //           "Start date should be current calender year."
    //         );
    //   }
    // }
  } else if (control === "dateTime") {
    const commonConvert = (d) => {
      return moment(d).format("YYYY-MM-DD, h:mm a");
    };
    if (validation.type === "dateTime")
      if (validation.required) {
        return Yup.string()
          .nullable()
          .required("Field can't be empty")
          .test("compare value", function (value) {
            const min = validation?.minDate
                ? moment(commonConvert(validation.minDate)).valueOf()
                : false,
              max = validation?.maxDate
                ? moment(commonConvert(validation.maxDate)).valueOf()
                : false,
              curr = moment(commonConvert(value)).valueOf();

            if (max && min) {
              if (curr < min && curr > max) {
                return this.createError({
                  message: `Date & Time should be between given or selected minimum(${moment(
                    validation.minDate
                  ).format("DD-MM-YYYY, h:mm a")}) and maximum(${moment(
                    validation.maxDate
                  ).format("DD-MM-YYYY, h:mm a")})`,
                  path: this.path,
                });
              }
            } else if (max) {
              if (curr > max) {
                return this.createError({
                  message: `Date & Time should be less than given or selected maximum(${moment(
                    validation.maxDate
                  ).format("DD-MM-YYYY, h:mm a")})`,
                  path: this.path,
                });
              }
            } else if (min) {
              if (curr < min) {
                return this.createError({
                  message: `Date & Time should be greater than given or selected minimum(${moment(
                    validation.minDate
                  ).format("DD-MM-YYYY, h:mm a")})`,
                  path: this.path,
                });
              }
            }
            return true;
          });
      } else {
        return Yup.string()
          .nullable("Field can't be empty")
          .test("compare value", function (value) {
            const min = validation?.minDate
                ? moment(commonConvert(validation.minDate)).valueOf()
                : false,
              max = validation?.maxDate
                ? moment(commonConvert(validation.maxDate)).valueOf()
                : false,
              curr = moment(commonConvert(value)).valueOf();

            if (max && min) {
              if (curr < min && curr > max) {
                return this.createError({
                  message: `Date & Time should be between given or selected minimum(${moment(
                    validation.minDate
                  ).format("DD-MM-YYYY, h:mm a")}) and maximum(${moment(
                    validation.maxDate
                  ).format("DD-MM-YYYY, h:mm a")})`,
                  path: this.path,
                });
              }
            } else if (max) {
              if (curr > max) {
                return this.createError({
                  message: `Date & Time should be less than given or selected maximum(${moment(
                    validation.maxDate
                  ).format("DD-MM-YYYY, h:mm a")})`,
                  path: this.path,
                });
              }
            } else if (min) {
              if (curr < min) {
                return this.createError({
                  message: `Date & Time should be greater than given or selected minimum(${moment(
                    validation.minDate
                  ).format("DD-MM-YYYY, h:mm a")})`,
                  path: this.path,
                });
              }
            }
            return true;
          });
      }
  } else if (control === "multiple" || control === "tree") {
    if (validation.type === "true") {
      if (validation.required)
        return Yup.array()
          .min(1, "Field can't be empty")
          .required("Field can't be empty");
      return Yup.array().min(0, "Length Exceed");
    }
  } else if (control === "password") {
    if (validation.type === "string") {
      if (validation.required) {
        return Yup.string().required("Field can't be empty");
      }
    } else if (validation.type === "mpin") {
      if (validation.required) {
        return Yup.string()
          .matches(MpinValidation, "PIN should be in Numeric and of 4 Digits")
          .required("Field can't be empty")
          .max(4, "Only 4 Digit Number should be there");
      }
    } else if (validation.type === "confirmMpin") {
      if (validation.required) {
        return Yup.string()
          .oneOf([Yup.ref("mpin")], "Confirm PIN must match With New PIN")
          .required("Field can't be empty");
      }
    } else if (validation.type === "true") {
      if (validation.required)
        return Yup.string()
          .matches(
            passwordValidation,
            "Minimum 8 characters, at least one letter, one number and one special character"
          )
          .required("Field can't be empty");
      return Yup.string().matches(
        passwordValidation,
        "Minimum 8 characters, at least one letter, one number and one special character"
      );
    } else if (validation.type === "confirmPassword") {
      if (validation.required)
        return Yup.string()
          .oneOf(
            [Yup.ref(validation?.compField || "NewPassword")],
            "Confirm Password must match With New Password"
          )
          .required("Field can't be empty");
      return Yup.string().oneOf(
        [Yup.ref("NewPassword")],
        "Confirm Password must match With New Password"
      );
    }
  } else if (control === "email") {
    if (validation.type === "true") {
      if (validation.required)
        return Yup.string()
          .email("Invalid Email id")
          .required("Field can't be empty");
      return Yup.string().email("Invalid Email id");
    }
  } else if (control === "select" || control === "select2") {
    if (validation.type === "max") {
      if (validation.required)
        return Yup.string()
          .max(
            validation.max,
            `You can't use more than ${validation.max} characters.`
          )
          .required("Field can't be empty");
      return Yup.string().max(
        validation.max,
        `You can't use more than ${validation.max} characters.`
      );
    } else if (validation.type === "true") {
      if (validation.required && validation.obj)
        return Yup.object()
          .required("Field can't be empty")
          .typeError("Field can't be empty");

      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .typeError("Field can't be empty");
      return Yup.string();
    }
  } else if (control === "time") {
    if (validation.type === "true") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .typeError("Please Enter The Correct Time Format");
      }
      return Yup.string();
    }
    if (validation.type === "minTime") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .test("compare value", function (value) {
            const startTime = this.resolve(Yup.ref("inTime"));
            const endTime = this.resolve(Yup.ref("outTime"));

            if (new Date(endTime).valueOf() <= new Date(startTime).valueOf()) {
              return this.createError({
                message: "Out time cannot be less than or equal to In time",
                path: "outTime",
              });
            } else {
              return true;
            }
          })

          .typeError("Please Enter The Time");

        // .min(
        //   moment(Yup.ref("inTime")).format("HH:mm"),
        //   "End time can't be before or equal to Start shift time"
        // );
      }
      return Yup.string();
    }
  } else if (control === "table") {
    if (validation.type === "normal") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .trim("Can not contain only space.");
      } else {
        return Yup.string()
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      }
    }

    if (validation.type === "true") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      } else {
        return Yup.string()
          .nullable()
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      }
    }

    if (validation.type === "AllCharacters") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      else {
        return Yup.string()
          .trim("Can not contain only space.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      }
    }

    if (validation.type === "withoutSymbol") {
      if (validation.required)
        return Yup.string()
          .required("Field can't be empty")
          .matches(
            validation?.allowRegex ?? symbolValidation,
            validation?.msg ?? "Only alphanumeric values are allowed."
          )
          .trim("This field cannot contain only blank spaces.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      else {
        return Yup.string()
          .nullable()
          .matches(
            validation?.allowRegex ?? symbolValidation,
            validation?.msg ?? "Only alphanumeric values are allowed."
          )
          .trim("This field can not contain only blank spaces.")
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} characters.`
          );
      }
    }

    if (validation.type === "string")
      if (validation.required)
        return (
          Yup.string()
            .required("Field can't be empty")
            // .matches(stringValidation, "Only alphabets are allowed.")
            .matches(
              validation?.allowRegex || stringValidation,
              validation?.msg || "Only alphabets are allowed."
            )
            .trim("Can not contain only space.")
            .max(
              validation.max || 25,
              `You can't use more than ${validation.max || 25} characters.`
            )
        );
      else {
        return Yup.string()
          .nullable()
          .trim("Can not contain only space.")
          .matches(stringValidation, "Only alphabets are allowed.")
          .max(
            validation.max || 25,
            `You can't use more than ${validation.max || 25} characters.`
          );
      }
    if (validation.type === "numeric")
      if (validation.required)
        return Yup.string()
          .trim("Can not contain only space.")
          .required("Field can't be empty")
          .matches(
            validation?.allowRegex ?? numberValidation,
            validation?.msg || "Only numbers allowed."
          )
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} digits.`
          );
      else {
        return Yup.string()
          .matches(
            validation?.allowRegex ?? numberValidation,
            validation?.msg || "Only numbers allowed."
          )
          .max(
            validation.max ?? 60,
            `You can't use more than ${validation.max ?? 60} digits.`
          );
      }
    if (validation.type === "date")
      if (validation.required)
        return Yup.date()
          .transform(function (value, originalValue) {
            if (this.isType(value)) {
              return value;
            }
            const result =
              moment(originalValue).format("DD-MM-YYYY") || moment();
            return result;
          })
          .typeError(validation.msg || "Please enter a valid date.")
          .required("Field can't be empty");
      else {
        return Yup.date()
          .transform(function (value, originalValue) {
            if (this.isType(value)) {
              return value;
            }
            const result =
              moment(originalValue).format("DD-MM-YYYY") || moment();
            return result;
          })
          .typeError(validation.msg || "Please enter a valid date.");
      }

    if (validation.type === "select")
      if (validation.required)
        return Yup.string().required("Field can't be empty");
      else {
        return Yup.string();
      }
    if (validation.type === "multiselect") {
      if (validation.required)
        return Yup.array()
          .min(1, "Field can't be empty")
          .required("Field can't be empty");
      return Yup.array().min(0, "Length Exceed");
    }

    if (validation.type === "time") {
      if (validation.required) {
        return Yup.string()
          .required("Field can't be empty")
          .typeError("Please Enter The Correct Time Format");
      }
      return Yup.string();
    }
    if (validation.type === "minTime") {
      if (validation.required) {
        return Yup.string()
          .test("compare value", function (value) {
            const startTime = this.resolve(Yup.ref("inTime"));
            const endTime = this.resolve(Yup.ref("outTime"));

            if (new Date(endTime).valueOf() < new Date(startTime).valueOf()) {
              return this.createError({
                message: "Out time cannot be less than In time",
                path: "outTime",
              });
            } else {
              return true;
            }
          })
          .required("Field can't be empty")
          .typeError("Please Enter The Correct Time Format");

        // .min(
        //   moment(Yup.ref("inTime")).format("HH:mm"),
        //   "End time can't be before or equal to Start shift time"
        // );
      }
      return Yup.string();
    }
  } else if (control === "fileUploader") {
    const initErr = {
      msg: "",
      errorOnFile: {},
      max: false,
      noFile: false,
      isErrorOnFile: 0,
    };
    const fileValidator = async (fileList) => {
      const maxFlag = validation?.maxFiles
        ? !(validation?.maxFiles >= fileList?.length)
        : false;
      let err = {
        ...initErr,
        msg: maxFlag
          ? `Maximum ${validation?.maxFiles} files are accepted at a time`
          : "Invalid files selected",
        max: maxFlag,
        noFile: false,
      };

      let temp = {};
      fileList.forEach(({ file: f, uuid }) => {
        if (validation?.fileCheck?.length) {
          if (validation?.fileCheck.indexOf(f.type) == -1) {
            temp[uuid] = `Invalid Format`;
          }
        }
        if (validation?.maxSize) {
          if (validation?.maxSize < f.size) {
            temp[uuid] = temp?.[uuid]
              ? temp[uuid] + " & " + `size to large`
              : `Size to large`;
          }
        }
      });
      err.errorOnFile = temp;
      return { ...err, isErrorOnFile: Object.keys(err?.errorOnFile).length };
    };
    if (validation?.required) {
      return Yup.array()
        .min(
          1,
          JSON.stringify({
            ...initErr,
            msg: `Please select a file`,
            noFile: true,
          })
        )
        .required(
          JSON.stringify({
            ...initErr,
            msg: `Please select a file`,
            noFile: true,
          })
        )
        .test("compareFile", async function () {
          let fileList =
            this.originalValue || this.resolve(Yup.ref(validation?.name)) || [];
          const error = await fileValidator(fileList);
          if (error?.max || error?.noFile || error?.isErrorOnFile) {
            return this.createError({
              message: JSON.stringify(error),
              path: validation?.name,
            });
          }
          return true;
        });
    } else {
      return Yup.array().test("compareFile", async function () {
        let fileList =
          this.originalValue || this.resolve(Yup.ref(validation?.name)) || [];
        const error = await fileValidator(fileList);
        if (error?.max || error?.noFile || error?.isErrorOnFile) {
          return this.createError({
            message: JSON.stringify(error),
            path: validation?.name,
          });
        }
        return true;
      });
    }
  } else if (control === "component") {
    if (validation.required)
      return Yup.string()
        .required("Field can't be empty")
        .trim("Can not contain only space.");
  }
}

export default ValidationType;
