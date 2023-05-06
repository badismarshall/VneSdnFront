<script setup>
import { ref } from 'vue';
const is_expanded =ref(localStorage.getItem('is_expanded') === 'true');

const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value;

	localStorage.setItem('is_expanded', is_expanded.value.toString());
}
</script>
<template>
    <aside :class="`${is_expanded && 'is-expanded'}`">
        <div class="logo">
            <img src="../assets/neural.png" alt="logo">
        </div>

        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu">
                <sapn class="material-icons">
                    keyboard_double_arrow_right
                </sapn>
            </button>
        </div>
        <h3>Menu</h3>
        <div class="menu">
            <Router-link class="button" to="/">
                <span class="material-icons">
                    home
                </span>
                <span class="text">Home</span>
            </Router-link>
            <Router-link class="button" to="/create">
                <span class="material-icons">
                    add
                </span>
                <span class="text">Create</span>
            </Router-link>
            <Router-link class="button" to="/edit">
                <span class="material-icons">
                    edit
                </span>
                <span class="text">Edit</span>
            </Router-link>
            <Router-link class="button" to="/delete">
                <span class="material-icons">
                    delete
                </span>
                <span class="text">Delete</span>
            </Router-link>
        </div>
    </aside>
</template>

<style scoped lang="scss">
aside {
	// position: fixed;
	display: flex;
	flex-direction: column;
	background-color: var(--dark);
	color: var(--light);
	width: calc(2rem + 32px);
	overflow: hidden;
	overflow-x: hidden;
	min-height: 100vh;
	padding: 1rem;
	transition: 0.2s ease-in-out;
	top: 0; /* Stay at the top */
	left: 0;
	// position: fixed;
	// z-index: 1;
	.flex {
		flex: 1 1 0%;
	}
	.logo {
		margin-bottom: 1rem;
		img {
			width: 2rem;
		}
	}
	.menu-toggle-wrap {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
		position: relative;
		top: 0;
		transition: 0.2s ease-in-out;
		.menu-toggle {
			transition: 0.2s ease-in-out;
			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-out;
			}
			
			&:hover {
				.material-icons {
					color: var(--primary);
					transform: translateX(0.5rem);
				}
			}
		}
	}
	h3, .button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}
	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
	}
	.menu {
		margin: 0 -1rem;
		.button {
			display: flex;
			align-items: center;
			text-decoration: none;
			transition: 0.2s ease-in-out;
			padding: 0.5rem 1rem;
			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}
			.text {
				color: var(--light);
				transition: 0.2s ease-in-out;
			}
			&:hover {
				background-color: var(--dark-alt);
				.material-icons, .text {
					color: var(--primary);
				}
			}
			&.router-link-exact-active {
				background-color: var(--dark-alt);
				border-right: 5px solid var(--primary);
				.material-icons, .text {
					color: var(--primary);
				}
			}
		}
	}
	.footer {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		p {
			font-size: 0.875rem;
			color: var(--grey);
		}
	}
	&.is-expanded {
		width: var(--sidebar-width);
		.menu-toggle-wrap {
			top: -3rem;
			
			.menu-toggle {
				transform: rotate(-180deg);
			}
		}
		h3, .button .text {
			opacity: 1;
		}
		.button {
			.material-icons {
				margin-right: 1rem;
			}
		}
		.footer {
			opacity: 0;
		}
	}
	@media (max-width: 1920px) {
		position: fixed;
		z-index: 30;
	}
}

</style>

