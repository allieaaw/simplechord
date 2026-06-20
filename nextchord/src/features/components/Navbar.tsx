import "@/shared/styles/styles.css"

export const Navbar = () => {
    return (
        <header>
            <div className="logo">
            <img src="images/logo.svg" alt="SimpleChord logo" width="48px" height="48px" style={{ marginRight: '16px' }} />
            <span className="logo-simple">Simple</span><span className="logo-chord">Chord</span>
            </div>
        </header>
    )
}