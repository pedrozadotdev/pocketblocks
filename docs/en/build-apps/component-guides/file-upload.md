# File upload

## Basics

You can customize the properties of the file upload components in the right panel, such as the displayed text, file types, upload type.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/01.png" alt=""><figcaption></figcaption></figure>

### File type

You can input an array of strings to restrict the types of the files to be uploaded. The default value of file type is empty, meaning that no limitation is pre-defined. Each string value in a specified file type array should be a [unique file type specifier](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers) in one of the following formats.

- A valid case-insensitive filename extension, starting with a period character ("."), such as `.png`, `.txt`, and `.pdf`.
- A valid string in [MIME format](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) without an extension.
- String `audio/*` indicating "any audio file".
- String `video/*` indicating "any video file".
- String `image/*` indicating "any image file".

For example, when the value of file type is `[".pdf", ".mp4", "image/*"]`, you can upload PDF files, MP4 files, and any type of image files.

### Upload type

You can decide whether to upload a single file, multiple files, or a directory.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/02.png" alt=""><figcaption></figcaption></figure>

### Display uploaded files

Switch on or off **Show upload list** to display or hide the list of the uploaded files. You can also set this property via JS code. By default, its value is "true".

The upload list presents the file names of all uploaded files in chronological order. You can also access the name of the uploaded files via the property `files[index].name`. When hovering your mouse over a file, the 🗑️ icon appears and you can click it to delete the corresponding file.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/03.png" alt=""><figcaption></figcaption></figure>

### Parse files

Toggle **Parse files** and PocketBlocks will try to parse the uploaded file data structure into objects, arrays, or strings. You can access the parsed result via the property `parsedValue`. PocketBlocks supports parsing Excel, JSON, and CSV files. The parsing result of other types of files is `null`.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/04.png" alt=""><figcaption></figcaption></figure>

## Validation

Under the validation tab, you can configure how many files are allowed to be uploaded, as well as the minimum and maximum size of a single file to be uploaded.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/05.png" alt=""><figcaption></figcaption></figure>

### Max files

When the upload type is "Multiple" or "Directory", you can set **Max files** to limit the maximum number of files to upload. If the number of files to be uploaded exceeds this threshold, the latest uploaded files will replace the oldest ones.

### File size

You can set the minimum and maximum size of the files to upload, using KB, MB, GB, or TB units. The default unit for file size is byte.When the size of the uploaded file exceeds the limit, you will see a global alert.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/06.png" alt=""><figcaption></figcaption></figure>

### Access uploaded files

Files uploaded via the file upload component are stored in browser cache memory in **base64-encoded** string format. To store these files in data sources, you need to build queries to connect to databases or APIs.You can view the properties of the uploaded files in the data browser in the left pane, or access property names in `{{}}` or JS queries via JS code. Commonly used properties are as follows.

- `value`: A list of the content of the uploaded files, encoded in base64.
- `files`: A list of metadata of the uploaded files, including `uid`, `name`, `type`, `size`, and `lastModified`.
- `parsedValue`: A list of the value of the parsed files.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/07.png" alt=""><figcaption></figcaption></figure>
