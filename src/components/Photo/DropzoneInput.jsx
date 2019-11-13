import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Icon, Header } from "semantic-ui-react"

const DropzoneInpiut = ({ setFiles }) => {
	const onDrop = useCallback(
		acceptedFiles => {
			setFiles(
				acceptedFiles.map(file =>
					Object.assign(file, {
						preview: URL.createObjectURL(file)
					})
				)
			)

			// Do something with the files
		},

		[setFiles]
	)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: "image/*"
	})

	return (
		<div
			{...getRootProps()}
			className={"dropzone " + (isDragActive && "dropzone--isActive")}
		>
			<input {...getInputProps()} />
			<Icon name="upload" size="huge" />
			<Header size="small">
				<Header.Content>画像ファイルを</Header.Content>
				<Header.Content>ドロップしてください</Header.Content>
			</Header>
		</div>
	)
}
export default DropzoneInpiut
