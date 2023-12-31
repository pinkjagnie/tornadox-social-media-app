"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Form, Formik } from "formik";

import pb from "@/lib/pocketbase";
import { tornadoSchema } from "@/schemas/index";

import CustomInput from "../../form/custom/CustomInput";
import CustomTextarea from "../../form/custom/CustomTextarea";
import ImageForForm from "./ImageForForm";
import CustomCheckbox from "../../form/custom/CustomCheckbox";
import Message from "../../form/Message";

const EditTornadoForm = ({ tornado, imageUrl }) => {
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const onSubmit = async (values, actions) => {
    console.log(values);

    const enteredTitle = values.Title;
    const enteredShortMsg = values.ShortMessage;
    const enteredMsg = values.Message;
    const enteredAtt = values.Attachment;
    const enteredForAll = values.ForAll;

    const data = {
      UserIdentificator: user.UserIdentificator,
      Title: enteredTitle,
      ShortMessage: enteredShortMsg,
      Message: enteredMsg,
      Attachment: enteredAtt,
      ForAll: enteredForAll,
    };

    console.log(data);

    try {
      const record = await pb.collection("tornadoes").update(tornado.id, data);

      console.log("record ", record);
      actions.resetForm();

      window.scrollTo(0, 0); // automatic scroll to top of the page

      setMessage("Tornado successfully edited!");

      const timeout = setTimeout(() => {
        router.push(`/tornadoes/see/${user.UserIdentificator}`);
        clearTimeout(timeout);
      }, 2000);
    } catch (error) {
      console.log(error);

      window.scrollTo(0, 0); // automatic scroll to top of the page

      setErrorMsg("Something went wrong! " + error.data.message);

      // clearing the error message
      const timeout = setTimeout(() => {
        setErrorMsg("");
        clearTimeout(timeout);
      }, 3000);
    }
  };

  return (
    <>
      {(message || errorMsg) && (
        <Message message={message} errorMsg={errorMsg} />
      )}
      <Formik
        initialValues={{
          Title: tornado.Title,
          ShortMessage: tornado.ShortMessage,
          Message: tornado.Message,
          Attachment: tornado.Attachment,
          ForAll: tornado.ForAll,
        }}
        validationSchema={tornadoSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="form-control w-[90%] md:w-[60%] lg:w-[50%] p-6 mx-auto mt-2 mb-14 border-2 border-stone-200 rounded-md bg-stone-200">
            <CustomInput
              label="Title *"
              name="Title"
              type="text"
              info="Length: 2-20 characters"
            />
            <CustomInput
              label="Short message *"
              name="ShortMessage"
              type="text"
              info="Length: 2-40 characters"
            />
            <CustomTextarea
              label="Message *"
              name="Message"
              type="text"
              info="Length: 2-200 characters"
            />
            <ImageForForm
              tornado={tornado}
              imageUrl={imageUrl}
              setFieldValue={setFieldValue}
            />
            <CustomCheckbox
              type="checkbox"
              name="ForAll"
              label="Should this tornado be public?"
            />
            {!isSubmitting ? (
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn btn-outline bg-zinc-400 w-[80%] mx-auto block"
              >
                Edit tornado
              </button>
            ) : (
              <button className="btn btn-active btn-accent text-slate-50 w-[80%] mx-auto block">
                <span className="loading loading-spinner text-slate-50"></span>
                Editing
              </button>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditTornadoForm;
