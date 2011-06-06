%define module  @SHORT_NAME@

Name:       vigilo-%{module}
Summary:    @SUMMARY@
Version:    @VERSION@
Release:    1%{?dev}%{?dist}
Source0:    %{name}-%{version}.tar.gz
URL:        @URL@
Group:      System/Servers
BuildRoot:  %{_tmppath}/%{name}-%{version}-%{release}-build
License:    GPLv2
Buildarch:  noarch

BuildRequires:   python-setuptools
BuildRequires:   python-babel
BuildRequires:   python-genshi
BuildRequires:   python-simplejson

Requires:   python >= 2.5
Requires:   python-setuptools
Requires:   vigilo-common
Requires:   python-genshi
Requires:   python-babel
######### Dependance from python dependance tree ########
Requires:   vigilo-themes-default
Requires:   vigilo-common
Requires:   python-babel
Requires:   python-genshi
Requires:   python-configobj

Provides:   vigilo-themes


%description
@DESCRIPTION@
This module is part of the Vigilo Project <http://vigilo-project.org>

%prep
%setup -q

%build

%install
rm -rf $RPM_BUILD_ROOT
make install_pkg \
	DESTDIR=$RPM_BUILD_ROOT \
	PREFIX=%{_prefix} \
	SYSCONFDIR=%{_sysconfdir} \
	PYTHON=%{__python}


%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(644,root,root,755)
%doc COPYING.txt
%{python_sitelib}/*


%changelog
* Mon Feb 08 2010 Aurelien Bompard <aurelien.bompard@c-s.fr>
- initial package
