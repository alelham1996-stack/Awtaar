export default class AwtaarIntro {

    constructor() {


        this.element =
            document.createElement("div")


        this.element.id =
            "awtaar-intro"


        this.element.innerHTML = `

            <div class="awtaar-logo">

                <h1>AWTAAR</h1>

                <h2>أوتار</h2>

                <p>
                    A Journey Through The Universe
                </p>

            </div>

        `


        document.body.appendChild(
            this.element
        )


        // =========================================
        // ظهور المقدمة
        // =========================================

        setTimeout(() => {

            this.element.classList.add(
                "show"
            )

        }, 500)


        // =========================================
        // بداية اختفاء المقدمة
        // =========================================

        setTimeout(() => {

            this.element.classList.add(
                "hide"
            )

        }, 4200)


        // =========================================
        // انتهاء المقدمة
        // =========================================

        setTimeout(() => {

            this.destroy()


            // إخبار Engine أن المقدمة انتهت

            window.dispatchEvent(

                new Event(
                    "awtaar-ready"
                )

            )

        }, 6500)

    }


    // =============================================
    // إزالة المقدمة
    // =============================================

    destroy() {

        if (this.element) {

            this.element.remove()

        }

    }

}