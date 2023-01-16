/**
 * Counter
 */
export default class Counter {
    //region Constants
    UPDATE_TYPE_INCREMENT = "Increment";
    UPDATE_TYPE_DECREMENT = "Decrement";
    //endregion
    //region Class fields
    #_count;
    #_intervalID;
    //endregion

    //region Core
    /**
     * Initialise
     * @param {number} count - Initialise count amount to set
     */
    constructor(count = 0) {
        this.#_count = count;
    }

    /**
     * Increment
     * @param {number} step - Amount to increment by
     * @return {Counter}
     */
    increment(step = 1) {
        this.count = this.count + step;
        return this;
    }

    /**
     * Decrement
     * @param {number} step - Amount to decrement by
     * @return {Counter}
     */
    decrement(step = 1) {
        this.count = this.count - step;
        return this;
    }

    /**
     *
     * @param {number} updateEveryMS - How often to update the counter
     * @param {string} updateType - Increment or decrement?
     * @param {number} updateBy - Amount to increment/decrement by
     * @return {Counter}
     */
    startCounter(updateEveryMS = 1000, updateType = this.UPDATE_TYPE_INCREMENT, updateBy = 1) {
        if (this.intervalID) {
            clearInterval(this.intervalID);
        }

        console.log("Counter started.");
        this.intervalID = window.setInterval(() => {
            if (updateType === this.UPDATE_TYPE_INCREMENT) {
                this.increment(updateBy);
            } else {
                this.decrement(updateBy);
            }

            console.log(this.intervalID + " - " + this.count);
        }, updateEveryMS);
        return this;
    }

    /**
     * Stop the counter.
     * @param {number} afterMS - Milliseconds after which to stop the counter.
     * @return {Counter}
     */
    stopCounter(afterMS = 0) {
        if (this.intervalID) {
            if (afterMS === 0) {
                clearInterval(this.intervalID);
            } else {
                setTimeout(() => {
                    clearInterval(this.intervalID);
                    console.log("Counter stopped.");
                }, afterMS);
            }
        }

        return this;
    }
    //endregion

    //region Getters and setters
    /**
     * @returns {number}
     */
    get count() {
        return this.#_count;
    }

    /**
     * @param {number} val
     */
    set count(val) {
        this.#_count = val;
    }

    /**
     * @returns {number}
     */
    get intervalID() {
        return this.#_intervalID;
    }

    /**
     * @param {number} val
     */
    set intervalID(val) {
        this.#_intervalID = val;
    }
    //endregion
}