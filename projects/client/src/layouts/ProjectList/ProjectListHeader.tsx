const ProjectListHeader = () => {
  return (
    <div className="rounded-lg bg-white px-4 pt-3">
      <div className="grid grid-cols-12 items-center text-sm font-medium text-gray-700">
        <div className="col-span-4 flex items-center">
          <span>Наименование</span>
        </div>
        <div className="col-span-8 grid grid-cols-4">
          <div className="pl-2 border-l border-gray-300">Посетителей</div>
          <div className="pl-2 border-l border-gray-300">Показов</div>
          <div className="pl-2 border-l border-gray-300">Конверсий</div>
          <div className="pl-2 border-l border-gray-300">Процент активности</div>
        </div>
      </div>
    </div>
  )
}

export default ProjectListHeader
