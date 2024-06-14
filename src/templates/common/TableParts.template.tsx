import React, { FC, useCallback, useEffect, type ReactNode } from 'react';
import classNames from 'classnames';
import { flexRender, Table as TTableProps } from '@tanstack/react-table';
import { object } from 'yup';
import Table, { ITableProps, TBody, Td, TFoot, Th, THead, Tr } from '../../components/ui/Table';
import Icon from '../../components/icon/Icon';
import { CardFooter, CardFooterChild } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import { debounce } from 'lodash';

interface ITableHeaderTemplateProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
}
export const TableHeaderTemplate: FC<ITableHeaderTemplateProps> = ({ table }) => {
	return (
		<THead>
			{table.getHeaderGroups().map((headerGroup) => (
				<Tr key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
						<Th
							key={header.id}
							isColumnBorder={false}
							style={{
								width: header.column.getSize(),
								padding: '0.50rem 0.25rem',
							}}
							className={classNames({
								'text-left': header.id !== 'Actions',
								'text-center': header.id === 'Actions',
							})}>
							{header.isPlaceholder ? null : (
								<div
									key={header.id}
									aria-hidden='true'
									{...{
										className: header.column.getCanSort()
											? 'cursor-pointer select-none flex items-center'
											: '',
										onClick: header.column.getToggleSortingHandler(),
									}}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
									{{
										asc: (
											<Icon
												icon='HeroChevronUp'
												className='ltr:ml-1.5 rtl:mr-1.5'
											/>
										),
										desc: (
											<Icon
												icon='HeroChevronDown'
												className='ltr:ml-1.5 rtl:mr-1.5'
											/>
										),
									}[header.column.getIsSorted() as string] ?? null}
								</div>
							)}
						</Th>
					))}
				</Tr>
			))}
		</THead>
	);
};

interface ITableBodyTemplateProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
	renderSubComponent?: ReactNode | null | any;
}
export const TableBodyTemplate: FC<ITableBodyTemplateProps> = ({
	table,
	renderSubComponent = null,
}) => {
	return (
		<TBody>
			{table.getRowModel().rows.map((row) => (
				<>
					<Tr key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<Td
								key={cell.id}
								style={{
									width: cell.column.getSize(),
									padding: '0.25rem',
								}}
								className={classNames({
									'text-left': cell.column.id !== 'Actions',
									'text-center': cell.column.id === 'Actions',
								})}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Td>
						))}
					</Tr>
					{row.getIsExpanded() && renderSubComponent && (
						<Tr>
							<Td colSpan={row.getVisibleCells().length}>
								{renderSubComponent && renderSubComponent({ row })}
							</Td>
						</Tr>
					)}
				</>
			))}
		</TBody>
	);
};

interface ITableFooterTemplateProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
}
export const TableFooterTemplate: FC<ITableFooterTemplateProps> = ({ table }) => {
	return (
		<TFoot>
			{table.getFooterGroups().map((footerGroup) => (
				<Tr key={footerGroup.id}>
					{footerGroup.headers.map((header) => (
						<Th
							key={header.id}
							isColumnBorder={false}
							className={classNames({
								'text-left': header.id !== 'Actions',
								'text-center': header.id === 'Actions',
							})}>
							{''}
							{/* {header.isPlaceholder ? null : (
								<div
									key={header.id}
									aria-hidden='true'
									{...{
										className: header.column.getCanSort()
											? 'cursor-pointer select-none flex items-center'
											: '',
										onClick: header.column.getToggleSortingHandler(),
									}}>
									{flexRender(
										header.column.columnDef.footer,
										header.getContext(),
									)}
									{{
										asc: (
											<Icon
												icon='HeroChevronUp'
												className='ltr:ml-1.5 rtl:mr-1.5'
											/>
										),
										desc: (
											<Icon
												icon='HeroChevronDown'
												className='rtl:mr-6.5 ltr:ml-1.5'
											/>
										),
									}[header.column.getIsSorted() as string] ?? null}
								</div>
							)} */}
						</Th>
					))}
				</Tr>
			))}
		</TFoot>
	);
};

interface ITableTemplateProps extends Partial<ITableProps> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
	hasHeader?: boolean;
	hasFooter?: boolean;
	renderSubComponent?: any;
}
const TableTemplate: FC<ITableTemplateProps> = (props) => {
	const { children, hasHeader, hasFooter, table, renderSubComponent = null, ...rest } = props;

	return (
		<Table {...rest}>
			{children || (
				<>
					{hasHeader && <TableHeaderTemplate table={table} />}
					<TableBodyTemplate table={table} renderSubComponent={renderSubComponent} />
					{hasFooter && <TableFooterTemplate table={table} />}
				</>
			)}
		</Table>
	);
};
TableTemplate.defaultProps = {
	hasHeader: true,
	hasFooter: true,
};

interface ITableCardFooterTemplateProps extends Partial<ITableProps> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	table: TTableProps<any>;
	onChangesPageSize?: (pageSize: number) => void;
	onChangePage?: any;
	count?: number;
	pageSize?: number;
}

export const TableCardFooterTemplate: FC<ITableCardFooterTemplateProps> = ({
	table,
	onChangesPageSize = null,
	onChangePage = null,
	pageSize = null,
	count,
}) => {
	const pageSizeOptions = [10, 20, 30, 40, 50, 'All'];

	const handleChangePage = (pageValue: number) => {
		const page = table.getPageCount() > pageValue ? pageValue : table.getPageCount();
		onChangePage && onChangePage(page, true);
	};

	return (
		<CardFooter>
			<CardFooterChild>
				<Select
					value={
						pageSize !== null
							? count === Object.values(table?.getRowModel().rowsById).length
								? 'All'
								: pageSize
							: table.getState().pagination.pageSize ===
							  Object.values(table?.getRowModel().rowsById).length
							? 'All'
							: table?.getState().pagination.pageSize
					}
					onChange={(e) => {
						const selectedPageSize =
							e.target.value === 'All'
								? count
									? count
									: Object.values(table?.getRowModel().rowsById).length
								: Number(e.target.value);
						table.setPageSize(selectedPageSize);
						onChangesPageSize && onChangesPageSize(selectedPageSize);
					}}
					className='!w-fit'
					name='pageSize'>
					{pageSizeOptions.map((pageSize) => (
						<option key={pageSize} value={pageSize} className='text-neutral-950'>
							{pageSize === 'All' ? 'Show All' : `Show ${pageSize}`}
						</option>
					))}
				</Select>
			</CardFooterChild>

			<CardFooterChild>
				<Button
					onClick={() => {
						table.setPageIndex(0);
						onChangePage && onChangePage(0);
					}}
					isDisable={!table.getCanPreviousPage()}
					icon='HeroChevronDoubleLeft'
					className='!px-0'
				/>
				<Button
					onClick={() => {
						table.previousPage();
						onChangePage && onChangePage(table.getState().pagination.pageIndex);
					}}
					isDisable={!table.getCanPreviousPage()}
					icon='HeroChevronLeft'
					className='!px-0'
				/>
				<span className='flex items-center gap-1'>
					<div>Page</div>
					<strong>
						<Input
							value={table.getState().pagination.pageIndex + 1}
							disabled={true}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								table.setPageIndex(page);

								onChangePage && handleChangePage(page + 1);
							}}
							className='inline-flex !w-12 text-center'
							name='page'
						/>{' '}
						of {table.getPageCount()}
					</strong>
				</span>
				<Button
					onClick={() => {
						table.nextPage();
						onChangePage && onChangePage(table.getState().pagination.pageIndex + 2);
					}}
					isDisable={!table.getCanNextPage()}
					icon='HeroChevronRight'
					className='!px-0'
				/>
				<Button
					onClick={() => {
						table.setPageIndex(table.getPageCount() - 1);
						onChangePage && onChangePage(table.getPageCount());
					}}
					isDisable={!table.getCanNextPage()}
					icon='HeroChevronDoubleRight'
					className='!px-0'
				/>
			</CardFooterChild>
		</CardFooter>
	);
};

export default TableTemplate;
