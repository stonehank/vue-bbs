export default function registerServer (Component, ServerLayer) {
    Component.extends=ServerLayer
    return Component
}
