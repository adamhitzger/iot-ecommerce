"use client"

export default function Reklamace() {
    return(
        <>
            <h1 className="text-6xl font-bold text -center">Reklamační řád</h1>
            <ol className="list-decimal px-8 text-base">
                <li>Kupující je povinen dodané zboží bez zbytečného odkladu prohlédnout a o případných zjištěných vadách do 5 dnů informovat prodávajícího.
                </li>
                <li>Oznámení o zjištěných vadách musí kupující učinit písemně (e-mailem na info@hydroocann.com) do 5 dnů od převzetí zboží. V písemném oznámení musí kupující uvést zjištěné vady. Popsat, o jaké vady se jedná a jak se projevují. Písemné oznámení kupující odešle do sídla prodávajícího.
                </li>
                <li>K reklamaci je nutné předložit kopii faktury a doklad o dodání a zaplacení zboží, jehož vady jsou reklamovány.
                </li>
                <li>Prodávající nepřebírá odpovědnost za škody vyplývající z užití produktů, funkčních vlastností a škod z neodborného používání produktů, stejně jako škod způsobených chybnou manipulací. Na vady tohoto původu se nevztahuje ani poskytnutá záruka.</li>
                <li>Prodávající se zavazuje informovat zákazníka nejpozději do tří dnů od obdržení reklamace, o způsobu vyřízení reklamace.</li>
                </ol>
            </>
    )
}