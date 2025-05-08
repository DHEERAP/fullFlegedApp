// 


  import React from 'react'
  import {Editor } from '@tinymce/tinymce-react';
  import {Controller } from 'react-hook-form';


  export default function RTE({name, control, label, defaultValue = "", onEditorChange}) {
    return (
      <div className='w-full'> 
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
      name={name || "content"}
      control={control}
      defaultValue={defaultValue}
      render={({field: {onChange, value}}) => (
          <Editor
          apiKey='efmskk7fl6jezs4ubba28k3pcfmtfdh6lnd3eu08o4gb5rf4'
          value={value}
          onEditorChange={(content) => {
              // Ensure content is a string and handle HTML entities
              const processedContent = String(content || '')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&mdash;/g, '—')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'");
              
              onChange(processedContent);
              if (onEditorChange) {
                  onEditorChange(processedContent);
              }
          }}
          onPaste={(e) => {
              // Handle paste event and clean the content
              const pastedContent = e.clipboardData.getData('text/html') || e.clipboardData.getData('text');
              if (pastedContent) {
                  const processedContent = String(pastedContent)
                      .replace(/&nbsp;/g, ' ')
                      .replace(/&mdash;/g, '—')
                      .replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&#39;/g, "'");
                  
                  onChange(processedContent);
                  if (onEditorChange) {
                      onEditorChange(processedContent);
                  }
              }
          }}
          init={{
              height: 500,
              menubar: true,
              plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "anchor",
              ],
              toolbar:
              "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              paste_data_images: true,
              paste_as_text: false,
              paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,br",
              paste_retain_style_properties: "all",
              entity_encoding: 'raw',
              encoding: 'xml'
          }}
          />
      )}
      />

      </div>
    )
  }



