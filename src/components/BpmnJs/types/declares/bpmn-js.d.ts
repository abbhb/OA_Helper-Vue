declare module "bpmn-js/lib/util/ModelUtil" {
    /**
     * Is an element of the given BPMN type?
     *
     * @param  element
     * @param  type
     *
     * @return
     */
    // eslint-disable-next-line no-use-before-define
    export function is(element: Element | ModdleElement, type: string): boolean;

    /**
     * Return true if element has any of the given types.
     *
     * @param element
     * @param types
     *
     * @return
     */
    // eslint-disable-next-line no-use-before-define
    export function isAny(element: Element | ModdleElement, types: string[]): boolean;

    /**
     * Return the business object for a given element.
     *
     * @param element
     *
     * @return
     */
    // eslint-disable-next-line no-use-before-define
    export function getBusinessObject(element: Element | ModdleElement): ModdleElement;

    /**
     * Return the di object for a given element.
     *
     * @param element
     *
     * @return
     */
    // eslint-disable-next-line no-use-before-define
    export function getDi(element: Element): ModdleElement;

    type Element = import("../model/Types").Element;
    type ModdleElement = import("../model/Types").ModdleElement;
}
