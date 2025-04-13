// components/VideoRow.js
import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const VideoRow = ({ video, onDelete }) => {
	return (
		<tr>
			<td>{video.file_name || 'Без названия'}</td>
			<td>
				<a href={video.file_path} target='_blank' rel='noopener noreferrer'>
					{video.file_path}
				</a>
			</td>
			<td className='d-flex flex-wrap gap-2'>
				<Link
					to={`/videos/${video.id}/edit`}
					className='btn btn-outline-primary btn-sm me-2'
				>
					Редактировать
				</Link>

				<Button
					variant='outline-danger'
					size='sm'
					onClick={() => onDelete(video.id)}
				>
					Удалить
				</Button>
			</td>
		</tr>
	)
}

export default VideoRow
