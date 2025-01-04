"use client"

export default function DopravaPlatba() {
    return(
        <>
            <h1 className="text-6xl font-bold text -center">Doprava a platba zboží</h1>
            <ol className="list-decimal px-8 text-base">
                <li><span>Způsoby dopravy</span>
                    <ul>
                    Zásilkovna - Cena dopravy již od 89 Kč.
                    </ul>
                </li>
                <li>
                    <span>Způsoby platby</span>
                    <ul>
                        <li>
                        Dobírkou - Zboží bude zasláno na dobírku, částku vybere od zákazníka doručovatel nebo pracovnice pošty při převzetí balíku.
                        </li>
                        <li>Bankovním převodem - Klasický převod na účet 123-7895890287/0100 (FIO) (Jako variabilní symbol uveďte &quot;číslo objednávky&quot;).</li>
                    </ul>
                </li>
                  </ol>
            </>
    )
}